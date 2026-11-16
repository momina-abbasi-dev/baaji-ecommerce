import express from "express";
import Banner from "../models/Banner.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or update banners (max 4)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "Please upload at least one banner image" });
    }
    if (images.length > 4) {
      return res.status(400).json({ message: "You can upload maximum 4 banner images" });
    }

    let banner = await Banner.findOne();
    if (banner) {
      banner.images = images;
      await banner.save();
      return res.json({ message: "Banners updated successfully", banner });
    }

    banner = new Banner({ images });
    await banner.save();
    res.json({ message: "Banners created successfully", banner });
  } catch (error) {
    res.status(500).json({ message: "Error saving banners", error: error.message });
  }
});

// Get banners
router.get("/", async (req, res) => {
  try {
    const banner = await Banner.findOne();
    res.json(banner || { images: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error: error.message });
  }
});

export default router;