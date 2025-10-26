import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

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

// ✅ API Routes
app.use("/api/upload", uploadRoutes);      // Cloudinary uploads
app.use("/api/admin", adminRoutes);        // Admin routes
app.use("/api/products", productRoutes);   // Product routes

// Serve frontend build (for production)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all route to serve React frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Root API route (optional)
app.get("/", (req, res) => {
  res.send("🛍️ Fashion Store API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
