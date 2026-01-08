import bcrypt from "bcryptjs";
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import { fileURLToPath } from "url";
import { SendProgramEmail } from "./utils/SendProgramEmail.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS (works for dev + production; you can restrict later using CLIENT_URL)
app.use(cors());
app.use(express.json());

// ✅ Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer storage for equipment images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ DB Connection (Railway env variables)
// Make sure your Render Environment Variables include:
// MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLPORT, MYSQLDATABASE
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: Number(process.env.MYSQLPORT),
  database: process.env.MYSQLDATABASE, // ✅ IMPORTANT FIX
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// ✅ Debug endpoint (TEMP - remove later if you want)
app.get("/debug/db", (req, res) => {
  db.query("SELECT DATABASE() AS db, @@hostname AS host", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0]);
  });
});

// ✅ Create User (Strong + always hashes password + prevents duplicates)
app.post("/users", async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  if (!username || !email || !password || !phone_number) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    db.query(
      "SELECT user_id FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, existing) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (existing.length > 0) {
          return res.status(409).json({ message: "Username or email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const q =
          "INSERT INTO users (username,email,password,phone_number) VALUES (?,?,?,?)";

        db.query(q, [username, email, hashedPassword, phone_number], (err2, data) => {
          if (err2) return res.status(500).json(err2);
          return res.status(201).json({ message: "User registered", user_id: data.insertId });
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login API (bcrypt compare + JWT)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT user_id, username, password FROM users WHERE username = ?";

  db.query(q, [username], async (err, data) => {
    if (err) return res.status(500).json("Database error");
    if (data.length === 0) return res.status(401).json("Invalid credentials");

    const user = data[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json("Invalid credentials");

      const token = jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ user_id: user.user_id, username: user.username, token });
    } catch (e) {
      return res.status(500).json("Server error");
    }
  });
});

// ✅ Get Users
app.get("/users", (req, res) => {
  const q = "SELECT user_id, username, email, phone_number FROM users";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ✅ Delete User
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM users WHERE user_id = ?";
  db.query(q, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("User deleted successfully");
  });
});

// --- EQUIPMENT API ---

app.get("/equipment", (req, res) => {
  db.query("SELECT * FROM equipment", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/equipment", upload.single("image"), (req, res) => {
  const { equipment_name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  const q =
    "INSERT INTO equipment (equipment_name, description, price, image) VALUES (?,?,?,?)";

  db.query(q, [equipment_name, description, price, image], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      equipment_id: result.insertId,
      equipment_name,
      description,
      price,
      image,
    });
  });
});

app.put("/equipment/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const { equipment_name, description, price } = req.body;

  let imageName = req.file ? req.file.filename : req.body.existingImage || null;

  const q =
    "UPDATE equipment SET equipment_name=?, description=?, price=?, image=? WHERE equipment_id=?";

  db.query(q, [equipment_name, description, price, imageName, id], (err) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database update failed", details: err });
    }
    res.json({ message: "Updated successfully", image: imageName });
  });
});

app.delete("/equipment/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT image FROM equipment WHERE equipment_id = ?", [id], (err, data) => {
    if (data && data[0]?.image) {
      const filePath = path.join(__dirname, "uploads", data[0].image);
      fs.unlink(filePath, () => {});
    }

    db.query("DELETE FROM equipment WHERE equipment_id = ?", [id], (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json("Deleted");
    });
  });
});

// --- PROGRAMS API ---

app.get("/programs", (req, res) => {
  db.query("SELECT * FROM programs", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/programs", (req, res) => {
  const { program_name, description, price, sheet_link, sheet_id } = req.body;

  const q =
    "INSERT INTO programs (program_name, description, price, created_at, sheet_link, sheet_id) VALUES (?, ?, ?, NOW(), ?, ?)";

  db.query(q, [program_name, description, price, sheet_link, sheet_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      program_id: result.insertId,
      program_name,
      description,
      price,
      sheet_link,
      sheet_id,
    });
  });
});

app.put("/programs/:id", (req, res) => {
  const { program_name, description, price, sheet_link, sheet_id } = req.body;

  const q =
    "UPDATE programs SET program_name=?, description=?, price=?, sheet_link=?, sheet_id=? WHERE program_id=?";

  db.query(q, [program_name, description, price, sheet_link, sheet_id, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Program updated");
  });
});

app.delete("/programs/:id", (req, res) => {
  db.query("DELETE FROM programs WHERE program_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Program deleted");
  });
});

// --- ORDERS API ---

app.post("/orders", (req, res) => {
  const { user_id, items } = req.body;

  const qOrder = "INSERT INTO orders (user_id, status, order_date) VALUES (?, 'Pending', NOW())";

  db.query(qOrder, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    const newOrderId = result.insertId;

    const itemValues = items.map((item) => [
      newOrderId,
      item.item_type,   // must be 'program' or 'equipment'
      item.item_id,
      item.item_name,
      item.price,
      item.quantity,
    ]);

    const qItems =
      "INSERT INTO order_items (order_id, item_type, item_id, item_name, price, quantity) VALUES ?";

    db.query(qItems, [itemValues], async (err2) => {
      if (err2) return res.status(500).json(err2);

      // ✅ Send emails for program items (don’t block checkout if email fails)
      try {
        // Get user email
        const [userRows] = await db.promise().query(
          "SELECT email FROM users WHERE user_id = ?",
          [user_id]
        );
        const userEmail = userRows?.[0]?.email;

        if (userEmail) {
          // for each program item, get sheet_link from programs table and email it
          const programItems = items.filter((i) => i.item_type === "program");

          for (const p of programItems) {
            const [progRows] = await db.promise().query(
              "SELECT program_name, sheet_link FROM programs WHERE program_id = ?",
              [p.item_id]
            );

            if (progRows.length > 0 && progRows[0].sheet_link) {
              await SendProgramEmail(userEmail, progRows[0].program_name, progRows[0].sheet_link);
            }
          }
        }
      } catch (emailErr) {
        console.log("Email send failed (order still created):", emailErr?.message || emailErr);
      }

      res.status(201).json({ message: "Order placed!", order_id: newOrderId });
    });
  });
});


// ✅ Admin orders (username + date + status)
app.get("/admin/orders", (req, res) => {
  const q = `
    SELECT orders.order_id, users.username, orders.status, orders.order_date 
    FROM orders 
    JOIN users ON orders.user_id = users.user_id
    ORDER BY orders.order_date DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
