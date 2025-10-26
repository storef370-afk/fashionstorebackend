import express from "express";
import Product from "../models/Product.js"; // make sure this file exists
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Simple admin password (you can change this anytime)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// 🟢 Admin Login
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// 🟢 Add Product
router.post("/products", async (req, res) => {
  const { name, price, category, description, image, password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = new Product({
      name,
      price,
      category,
      description,
      image,
    });
    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "❌ Error adding product", error });
  }
});

export default router;
