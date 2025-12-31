import bcrypt from 'bcryptjs';
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import orderRoutes from './routes/order.routes.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


const app=express();
app.use(cors());    
app.use(express.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"gymdatabase",
});
db.connect((err) => {
    if (err) {
        console.log("DB connection error:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

//register accounts api
app.post("/users", async (req, res) => {
  const q = "INSERT INTO users (username,email,password,phone_number) VALUES (?,?,?,?)";

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
   
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,  
      req.body.phone_number
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      return res.status(201).json({
        message: "User registered successfully",
        user_id: data.insertId
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
});



app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT user_id, username, password FROM users WHERE username = ?";

  db.query(q, [username], async (err, data) => {
    if (err) return res.status(500).json("Database error");

    if (data.length === 0) {
      return res.status(401).json("Invalid username or password");
    }

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid username or password");

    const token=jwt.sign({
        user_id:user.user_id,username:user.username
    },process.env.JWT_SECRET,{expiresIn:"1h"
    })
    res.json({
      user_id: user.user_id,
      username: user.username,
      token
    });
  });
});

app.get("/users",(req,res)=>{
    const q="SELECT user_id ,username , email, phone_number FROM users";
    db.query(q,(err,data)=>{
        if(err){
            console.log(err);
        return res.json(err);
}
        return res.json(data);
});
});
app.get('/orders',(req,res)=>{
     const query=` 
   SELECT
      orders.order_id,
      users.user_id,
      users.username,
      orders.status,
      orders.order_date,
      COALESCE(SUM(order_items.price * order_items.quantity), 0) AS total_price
    FROM orders
    JOIN users ON users.user_id = orders.user_id
    LEFT JOIN order_items ON order_items.order_id = orders.order_id
    GROUP BY orders.order_id, users.user_id, users.username, orders.status, orders.order_date
    ORDER BY orders.order_date DESC

`;
  db.query(query,(err,data)=>{
    if(err) {
        return res.json(err);
    }
        return res.json(data);
  });
});
app.use("/api/orders",orderRoutes);


app.delete('/users/:id',(req,res)=>{
    const user_id=req.params.id;
    const q="DELETE FROM users WHERE user_id=?";
    db.query(q,[user_id],(err,data)=>{
        if(err){
            console.log(err);
            return res.json(err);
        }
        return res.json("User deleted successfully");
    });
});





app.listen(5000,()=>{
    console.log(`Server is running on port 5000`);
});