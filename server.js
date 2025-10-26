import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Add a product (for admin)
app.post("/api/products", async (req, res) => {
  const { name, price, image, category, description } = req.body;
  const product = new Product({ name, price, image, category, description });
  await product.save();
  res.status(201).json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
