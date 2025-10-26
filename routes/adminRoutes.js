import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pedahelmylove247";

// Admin login (optional)
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) return res.json({ success: true });
  return res.status(401).json({ success: false, message: "Unauthorized" });
});

// Add new product
router.post("/products", async (req, res) => {
  const { password, name, price, category, description, image, video } = req.body;

  // Check admin password
  if (password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Unauthorized: wrong password" });

  // Validate required fields
  if (!name || !price || !image)
    return res.status(400).json({ message: "Missing required fields: name, price, or image" });

  try {
    const product = new Product({
      name,
      price,
      category: category || "",
      description: description || "",
      image,
      video: video || "",
    });

    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error saving product", error: err });
  }
});

export default router;
