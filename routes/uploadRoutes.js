import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "fashion_store",
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    public_id: file.originalname,
  }),
});

const parser = multer({ storage });

// Single file upload route
router.post("/", parser.fields([{ name: "image" }, { name: "video" }]), (req, res) => {
  try {
    const imageUrl = req.files.image ? req.files.image[0].path : null;
    const videoUrl = req.files.video ? req.files.video[0].path : null;
    res.json({ image: imageUrl, video: videoUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
