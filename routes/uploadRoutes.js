import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer setup (store files temporarily before upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route for image/video
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Upload failed", error });
        }
        res.json({ url: result.secure_url });
      }
    );

    // Write file buffer to Cloudinary stream
    result.end(file.buffer);
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
