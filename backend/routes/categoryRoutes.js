import express from "express";
import Category from "../models/Category.js";
import slugify from "slugify";
import { protect, admin } from "../middleware/authMiddleware.js";
import imagekit from "../config/imagekit.js";
import {
  categoryImageUpload,
  createImageKitFilename,
} from "../middleware/imageUpload.js";

const router = express.Router();

/* ----------------------------------
   ROUTES
---------------------------------- */

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add category (Admin)
router.post("/", protect, admin, categoryImageUpload, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const { name } = req.body;
    const isMenu = req.body.isMenu === "true";
    const slug = slugify(name, { lower: true });

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: createImageKitFilename("category", req.file),
        folder: "/baaji/categories",
      });
      imageUrl = uploadResult.url;
    }

    const category = new Category({
      name,
      slug,
      image: imageUrl,
      isMenu,
    });

    await category.save();
    res.status(201).json(category);
  } catch {
    console.error("Category creation failed.");
    res.status(500).json({ message: "Server error saving category" });
  }
});

// ✅ Update category (Admin)
router.put("/:id", protect, admin, categoryImageUpload, async (req, res) => {
  try {
    const { name } = req.body;
    const isMenu = req.body.isMenu === "true";
    const slug = name ? slugify(name, { lower: true }) : undefined;

    const updateData = {
      ...(name && { name }),
      ...(slug && { slug }),
      isMenu,
    };

    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: createImageKitFilename("category", req.file),
        folder: "/baaji/categories",
      });
      updateData.image = uploadResult.url;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);
  } catch {
    console.error("Category update failed.");
    res.status(500).json({ message: "Server error updating category" });
  }
});

// ✅ Delete category
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;