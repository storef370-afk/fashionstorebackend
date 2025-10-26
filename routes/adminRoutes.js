import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pedahelmylove247";

// Admin login
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// Admin add product
router.post("/products", async (req, res) => {
  const { password, name, price, image, video, category, description } = req.body;

  if (password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const product = new Product({ name, price, image, video, category, description });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error saving product", error: err });
  }
});

export default router;
