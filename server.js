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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/upload", uploadRoutes);      // Handles Cloudinary uploads
app.use("/api/admin", adminRoutes);        // Admin login & protected routes
app.use("/api/products", productRoutes);   // Product APIs

// Root route
app.get("/", (req, res) => {
  res.send("🛍️ Fashion Store API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
