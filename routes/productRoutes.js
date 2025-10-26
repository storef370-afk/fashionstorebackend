import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});

// ✅ POST add new product (basic, unprotected)
router.post("/", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;
    const product = new Product({ name, price, image, category, description });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
});

export default router;
