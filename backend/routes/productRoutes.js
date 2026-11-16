import express from "express";
import imagekit from "../config/imagekit.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createImageKitFilename,
  productImageUpload,
} from "../middleware/imageUpload.js";

const router = express.Router();

// ---------------- ImageKit Helper ----------------
const uploadToImageKit = async (fileBuffer, fileName, folder) => {
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName,
    folder,
  });
  return result.url;
};

// ---------------- Routes ----------------

// ---------------- GET ALL PRODUCTS ----------------
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- TRENDING PRODUCTS ----------------
router.get("/trending", async (req, res) => {
  try {
    const products = await Product.find({ isTrend: true }).limit(8);

    res.json(products);
  } catch (err) {
    console.error("Error fetching trending products:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- GET SINGLE PRODUCT ----------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new product (main + extra images)
router.post(
  "/",
  protect,
  admin,
  productImageUpload,
  async (req, res) => {
    console.log("========== NEW PRODUCT REQUEST ==========");
    console.log("REQ.BODY:", req.body);
    console.log("USER ID:", req.user?._id);

    try {
      const { title, price, category, shortDesc, description, sizes, sizeDesc, shipping, isTrend } = req.body;

      if (!title || !price || !category || !req.files?.mainImage?.length) {
        console.log("❌ Missing required fields");
        return res.status(400).json({
          message: "Missing required fields: title, price, category, main image",
        });
      }

      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        console.log("❌ Price is not a number:", price);
        return res.status(400).json({ message: "Price must be a number" });
      }

      // --- MAIN IMAGE UPLOAD ---
      let mainImageUrl;
      try {
        mainImageUrl = await uploadToImageKit(
          req.files.mainImage[0].buffer,
          createImageKitFilename("product-main", req.files.mainImage[0]),
          "/baaji/products/main"
        );
        console.log("✅ Main image uploaded:", mainImageUrl);
      } catch {
        console.error("ImageKit main image upload failed.");
        return res.status(500).json({
          message: "Failed to upload main image",
        });
      }

      // --- EXTRA IMAGES ---
      const extraImages = [];
      if (req.files?.images?.length) {
        for (const img of req.files.images) {
          try {
            const url = await uploadToImageKit(
              img.buffer,
              createImageKitFilename("product-extra", img),
              "/baaji/products/extra"
            );
            extraImages.push(url);
          } catch {
            console.warn("Extra product image upload failed.");
          }
        }
      }
      console.log("✅ Extra images uploaded:", extraImages);

      // --- PARSE SIZES ---
      const sizesArray = sizes ? sizes.split(",").map((s) => s.trim()) : ["S","M","L","XL"];

      // --- CREATE PRODUCT ---
      const product = new Product({
        title,
        price: numericPrice,
        category,
        shortDesc,
        description,
        sizes: sizesArray,
        sizeDesc,
        shipping,
        mainImage: mainImageUrl,
        images: extraImages,
        isTrend: isTrend === "true" || isTrend === true,
      });

      await product.save();
      console.log("✅ Product saved successfully:", product._id);
      res.status(201).json(product);

    } catch (err) {
      console.error("Product creation failed.");
      res.status(500).json({
        message: "Server error while saving product",
      });
    }
  }
);

// ✅ Update product
router.put(
  "/:id",
  protect,
  admin,
  productImageUpload,
  async (req, res) => {
    try {
      const existing = await Product.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Product not found" });

      const updateData = { ...req.body };

      // Convert price to number if sent
      if (updateData.price) {
        const priceNum = Number(updateData.price);
        if (isNaN(priceNum)) return res.status(400).json({ message: "Price must be a number" });
        updateData.price = priceNum;
      }

      // Parse sizes
      if (updateData.sizes)
        updateData.sizes = updateData.sizes.split(",").map((s) => s.trim());

      // Parse trending checkbox
      if (updateData.isTrend !== undefined)
        updateData.isTrend = updateData.isTrend === "true" || updateData.isTrend === true;

      // Update main image
      if (req.files?.mainImage?.length) {
        try {
          updateData.mainImage = await uploadToImageKit(
            req.files.mainImage[0].buffer,
            createImageKitFilename("product-main", req.files.mainImage[0]),
            "/baaji/products/main"
          );
          console.log("✅ Updated main image:", updateData.mainImage);
        } catch {
          console.error("ImageKit main image update failed.");
          return res.status(500).json({ message: "Failed to upload main image" });
        }
      }

      // Update extra images
      if (req.files?.images?.length) {
        const extraImages = [];
        for (const img of req.files.images) {
          try {
            const url = await uploadToImageKit(
              img.buffer,
              createImageKitFilename("product-extra", img),
              "/baaji/products/extra"
            );
            extraImages.push(url);
          } catch {
            console.warn("Extra product image update failed.");
          }
        }
        updateData.images = extraImages;
      }

      const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      console.log("✅ Product updated:", updated._id);
      res.json(updated);
    } catch (err) {
      console.error("Product update failed.");
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: "Validation error", errors: messages });
      }
      res.status(500).json({ message: "Server error updating product" });
    }
  }
);

export default router;