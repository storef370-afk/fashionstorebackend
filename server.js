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



// 🔐 Admin authentication (simple password check)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Admin login route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// Admin add product route (protected)
app.post("/api/admin/products", async (req, res) => {
  const { password, name, price, image, category, description } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = new Product({ name, price, image, category, description });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error saving product", error });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

