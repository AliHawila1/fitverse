import express from "express";
import db from "../db.js"; // your MySQL connection
import { SendProgramEmail } from "../SendProgramEmail.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { userId, userEmail, items, total } = req.body;

    if (!userId || !items || items.length === 0 || !userEmail) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // 1️⃣ Insert new order
    const orderResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO orders (user_id, total_price, order_date) VALUES (?, ?, NOW())",
        [userId, total],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const orderId = orderResult.insertId;

    // 2️⃣ Insert each item into order_items
    for (const item of items) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO order_items (order_id, item_type, item_id, item_name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)",
          [orderId, item.item_type, item.item_id, item.item_name, item.price, item.quantity],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      // 3️⃣ Send program email
      if (item.item_type === "program" && item.sheetLink) {
        await SendProgramEmail(userEmail, item.item_name, item.sheetLink);
      }
    }

    res.status(200).json({ message: "Order completed and program emails sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});

export default router;
