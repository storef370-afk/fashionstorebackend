import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Pedahelmylove247";

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

// POST add new product (admin only)
router.post("/", async (req, res) => {
  const { password, name, price, image, category, description } = req.body;

  // Admin authentication
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Validate required fields
  if (!name || !price || !image || !category || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({ name, price, image, category, description });
    const savedProduct = await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product: savedProduct });
  } catch (err) {
    console.error("Error saving product:", err.message);
    res.status(500).json({ message: "❌ Error saving product", error: err.message });
  }
});

export default router;
