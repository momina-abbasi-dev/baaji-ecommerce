import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
import imagekit from "../config/imagekit.js";
import {
  createImageKitFilename,
  eventImageUpload,
} from "../middleware/imageUpload.js";

const router = express.Router();

/* ----------------------------------
   ✅ CREATE EVENT (IMAGEKIT)
---------------------------------- */
router.post("/", protect, admin, eventImageUpload, async (req, res) => {
  try {
    const { title, date, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to ImageKit
    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: createImageKitFilename("event", req.file),
      folder: "/baaji/events",
    });

    const event = await Event.create({
      title,
      image: uploadResult.url, // ImageKit URL
      date,
      description,
    });

    res.status(201).json(event);
  } catch {
    console.error("Event creation failed.");
    res.status(500).json({ message: "Server error creating event" });
  }
});

/* ----------------------------------
   ✅ GET ALL EVENTS
---------------------------------- */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("❌ Fetch events error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------------
   ✅ DELETE EVENT
---------------------------------- */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Delete event error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;