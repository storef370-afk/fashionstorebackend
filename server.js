import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js"; // for Cloudinary uploads
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

// ✅ ROUTES
app.use("/api/upload", uploadRoutes); // Handles image/video uploads
app.use("/api/admin", adminRoutes);
// Root route
app.get("/", (req, res) => {
  res.send("🛍️ Fashion Store API is running...");
});

// ✅ Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

// ✅ Add a new product (basic, unprotected)
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;
    const product = new Product({ name, price, image, category, description });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
});

// 🔐 Admin password (set in .env)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// ✅ Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// ✅ Admin add product (protected)
app.post("/api/admin/products", async (req, res) => {
  const { password, name, price, image, category, description } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = new Product({ name, price, image, category, description });
    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving product", error });
  }
});

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
