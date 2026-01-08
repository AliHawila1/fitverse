import bcrypt from 'bcryptjs';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE =================
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  ssl: { rejectUnauthorized: false }
});


db.connect(err => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to MySQL database");
});

// ================= USERS =================
app.post("/users", async (req, res) => {
  const q = "INSERT INTO users (username,email,password,phone_number) VALUES (?,?,?,?)";
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const values = [req.body.username, req.body.email, hashedPassword, req.body.phone_number];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "User registered", user_id: data.insertId });
    });
  } catch {
    res.status(500).json("Server error");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT user_id, username, password FROM users WHERE username = ?";

  db.query(q, [username], async (err, data) => {
    if (err) return res.status(500).json("Database error");
    if (!data.length) return res.status(401).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, data[0].password);
    if (!isMatch) return res.status(401).json("Invalid credentials");

    const token = jwt.sign(
      { user_id: data[0].user_id, username: data[0].username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ user_id: data[0].user_id, username: data[0].username, token });
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT user_id, username, email, phone_number FROM users", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE user_id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json("User deleted");
  });
});

// ================= EQUIPMENT =================
app.get("/equipment", (req, res) => {
  db.query("SELECT * FROM equipment", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/equipment", upload.single("image"), (req, res) => {
  const { equipment_name, description, price } = req.body;
  const image = req.file?.filename || null;

  const q = "INSERT INTO equipment (equipment_name, description, price, image) VALUES (?,?,?,?)";
  db.query(q, [equipment_name, description, price, image], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ equipment_id: result.insertId });
  });
});

app.put("/equipment/:id", upload.single("image"), (req, res) => {
  const image = req.file?.filename || req.body.existingImage || null;
  const q = "UPDATE equipment SET equipment_name=?, description=?, price=?, image=? WHERE equipment_id=?";
  db.query(q, [req.body.equipment_name, req.body.description, req.body.price, image, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json("Updated");
    }
  );
});

app.delete("/equipment/:id", (req, res) => {
  db.query("SELECT image FROM equipment WHERE equipment_id=?", [req.params.id], (err, data) => {
    if (data?.[0]?.image) {
      fs.unlink(path.join(__dirname, "uploads", data[0].image), () => {});
    }
    db.query("DELETE FROM equipment WHERE equipment_id=?", [req.params.id], err => {
      if (err) return res.status(500).json(err);
      res.json("Deleted");
    });
  });
});

// ================= PROGRAMS =================
app.get("/programs", (req, res) => {
  db.query("SELECT * FROM programs", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/programs", (req, res) => {
  const q = `
    INSERT INTO programs (program_name, description, price, created_at, sheet_link, sheet_id)
    VALUES (?, ?, ?, NOW(), ?, ?)
  `;
  db.query(q, Object.values(req.body), (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ program_id: result.insertId });
  });
});

app.put("/programs/:id", (req, res) => {
  const q = `
    UPDATE programs SET program_name=?, description=?, price=?, sheet_link=?, sheet_id=?
    WHERE program_id=?
  `;
  db.query(q, [...Object.values(req.body), req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json("Updated");
  });
});

app.delete("/programs/:id", (req, res) => {
  db.query("DELETE FROM programs WHERE program_id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json("Deleted");
  });
});

// ================= ORDERS =================
app.post("/orders", (req, res) => {
  const { user_id, items } = req.body;

  const qOrder = "INSERT INTO orders (user_id, status, order_date) VALUES (?, 'pending', NOW())";
  db.query(qOrder, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    const orderId = result.insertId;
    const values = items.map(i => [
      orderId, i.item_type, i.item_id, i.item_name, i.price, i.quantity
    ]);

    db.query(
      "INSERT INTO order_items (order_id,item_type,item_id,item_name,price,quantity) VALUES ?",
      [values],
      err => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ order_id: orderId });
      }
    );
  });
});

// ================= ADMIN ORDERS =================
app.get("/admin/orders", (req, res) => {
  const q = `
    SELECT o.order_id,o.status,o.order_date,
           u.username,u.email,u.phone_number,
           oi.item_type,oi.item_name,oi.price,oi.quantity
    FROM orders o
    JOIN users u ON u.user_id=o.user_id
    LEFT JOIN order_items oi ON oi.order_id=o.order_id
    ORDER BY o.order_date DESC
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
