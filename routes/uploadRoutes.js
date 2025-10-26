import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // handles images and videos
    });
    fs.unlinkSync(req.file.path); // delete temp file
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
