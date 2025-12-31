import bcrypt from 'bcryptjs';
import express from 'express';
import mysql from 'mysql';
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gymdatabase",
});

db.connect((err) => {
    if (err) {
        console.log("DB connection error:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});


app.post("/users", async (req, res) => {
    const q = "INSERT INTO users (username,email,password,phone_number) VALUES (?,?,?,?)";
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const values = [req.body.username, req.body.email, hashedPassword, req.body.phone_number];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(201).json({ message: "User registered", user_id: data.insertId });
        });
    } catch (err) {
        res.status(500).json("Server error");
    }
});

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const q = "SELECT user_id, username, password FROM users WHERE username = ?";

    db.query(q, [username], async (err, data) => {
        if (err) return res.status(500).json("Database error");
        if (data.length === 0) return res.status(401).json("Invalid credentials");

        const user = data[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json("Invalid credentials");

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ user_id: user.user_id, username: user.username, token });
    });
});

// Get Users
app.get("/users", (req, res) => {
    const q = "SELECT user_id, username, email, phone_number FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// Delete User
app.delete('/users/:id', (req, res) => {
    const q = "DELETE FROM users WHERE user_id = ?";
    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json("User deleted successfully");
    });
});

//EQUIPMENTS API

app.get("/equipment", (req, res) => {
    const q = "SELECT * FROM equipment";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

app.post("/equipment", upload.single("image"), (req, res) => {
    const { equipment_name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;
    const q = "INSERT INTO equipment (equipment_name, description, price, image) VALUES (?,?,?,?)";
    db.query(q, [equipment_name, description, price, image], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ equipment_id: result.insertId, equipment_name, description, price, image });
    });
});

app.put("/equipment/:id", upload.single("image"), (req, res) => {
    const id = req.params.id;
    
    const { equipment_name, description, price } = req.body;
 
    let imageName = req.file ? req.file.filename : (req.body.existingImage || null);

    const q = "UPDATE equipment SET equipment_name=?, description=?, price=?, image=? WHERE equipment_id=?";
    
    db.query(q, [equipment_name, description, price, imageName, id], (err, result) => {
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
        if (data && data[0].image) {
            const filePath = path.join(__dirname, 'uploads', data[0].image);
            fs.unlink(filePath, (err) => { if (err) console.log("File not found on disk"); });
        }
        db.query("DELETE FROM equipment WHERE equipment_id = ?", [id], (err) => {
            if (err) return res.status(500).json(err);
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
    const q = "INSERT INTO programs (program_name, description, price, created_at, sheet_link, sheet_id) VALUES (?, ?, ?, NOW(), ?, ?)";
    db.query(q, [program_name, description, price, sheet_link, sheet_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ program_id: result.insertId, ...req.body });
    });
});

app.put("/programs/:id", (req, res) => {
    const { program_name, description, price, sheet_link, sheet_id } = req.body;
    const q = "UPDATE programs SET program_name=?, description=?, price=?, sheet_link=?, sheet_id=? WHERE program_id=?";
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


app.post("/orders", (req, res) => {
    const { user_id, items } = req.body;
    const qOrder = "INSERT INTO orders (user_id, status, order_date) VALUES (?, 'Pending', NOW())";
    db.query(qOrder, [user_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }        
        const newOrderId = result.insertId;
        const itemValues = items.map(item => [
            newOrderId,
            item.item_type,
            item.item_id,
            item.item_name,
            item.price,
            item.quantity
        ]);
        const qItems = "INSERT INTO order_items (order_id, item_type, item_id, item_name, price, quantity) VALUES ?";        
        db.query(qItems, [itemValues], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.status(201).json({ message: "Order placed!", order_id: newOrderId });
        });
    });
});


app.get("/orders", (req, res) => {
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


app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});