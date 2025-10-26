import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/upload", uploadRoutes); // for Cloudinary uploads
app.use("/api/admin", adminRoutes);   // Admin dashboard routes
app.use("/api/products", productRoutes); // Products routes

// Root route
app.get("/", (req, res) => {
  res.send("🛍️ Fashion Store API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
