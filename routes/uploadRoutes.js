import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,       // from .env
  api_key: process.env.CLOUD_API_KEY,       // from .env
  api_secret: process.env.CLOUD_API_SECRET, // from .env
});

// Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fashion_store", // all uploads go to this folder
    resource_type: "auto",   // allows images & videos
  },
});

// Multer parser using Cloudinary storage
const parser = multer({ storage });

// Upload endpoint
// POST /api/upload
router.post("/", parser.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path }); // returns Cloudinary URL
});

export default router;
