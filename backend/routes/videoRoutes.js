import express from "express";
import Video from "../models/Video.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload video
router.post("/", protect, admin, async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ message: "Video URL is required" });

    // Optional: delete old video (keep only one latest)
    await Video.deleteMany();

    const video = new Video({ url: videoUrl });
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Error saving video", error });
  }
});

// Get latest video
router.get("/", async (req, res) => {
  try {
    const video = await Video.findOne().sort({ createdAt: -1 });
    res.json(video ? [video] : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error });
  }
});

export default router;