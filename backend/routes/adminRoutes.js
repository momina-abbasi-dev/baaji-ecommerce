import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Dashboard summary (counts + total sales)
 */
router.get("/summary", protect, admin, async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      products,
      users,
      orders,
      totalSales: totalSales[0]?.total || 0,
    });
  } catch (err) {
    console.error("Error in summary route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Product CRUD for admins
 */
// Create a product
router.post("/products", protect, admin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products
router.get("/products", protect, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put("/products/:id", protect, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;