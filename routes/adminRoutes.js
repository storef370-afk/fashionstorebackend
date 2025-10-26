import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Admin password from .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pedahelmylove247";

// Admin login
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// Admin add product (protected)
router.post("/products", async (req, res) => {
  const { password, name, price, category, description, image, video } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = new Product({ name, price, category, description, image, video });
    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "❌ Error saving product", error: err });
  }
});

export default router;
