import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import client from "../config/twilio.js";

dotenv.config();
const router = express.Router();

/* ----------------------------------
   ✅ CREATE NEW ORDER
---------------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress?.country) {
      return res.status(400).json({ message: "Country is required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is currently available",
      });
    }
    if (shippingAddress.country !== "Pakistan") {
      return res.status(400).json({
        message: "Cash on Delivery is only available in Pakistan",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product).select(
          "title price mainImage sizes",
        );
        if (!product) throw new Error(`Product not found: ${item.product}`);

        return {
          product: item.product,
          title: product.title,
          price: product.price,
          image: product.mainImage,
          quantity: item.quantity,
          size: item.size || product.sizes[0] || "N/A",
        };
      }),
    );

    // ✅ Calculate total price securely on backend
    const itemsPrice = enrichedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // ✅ Shipping logic
    let shippingPrice = 0;

    if (shippingAddress.country === "Pakistan") {
      shippingPrice = 300;
    } else {
      shippingPrice = 300; // temporary same (can change later)
    }

    const calculatedTotal = itemsPrice + shippingPrice;

    const order = new Order({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotal, // ✅ secure price
      paymentStatus: "Pending",
      status: "Pending",
    });

    const createdOrder = await order.save();
    try {
      const message = `
      🛍️ NEW ORDER RECEIVED

      Customer Name: ${shippingAddress.name}
      Phone: ${shippingAddress.phone}
      Email: ${shippingAddress.email}
      Address: ${shippingAddress.address}
      City: ${shippingAddress.city}
      Postal Code: ${shippingAddress.postalCode}
      Country: ${shippingAddress.country}
      Payment: ${paymentMethod}
      Item: 
      ${enrichedItems.map((i) => `${i.title} (${i.size}) x${i.quantity}`).join("\n")}
      `;
      console.log("New order notification prepared.");
      const response = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP,
        to: process.env.OWNER_WHATSAPP,
        body: message,
      });
      console.log("✅ Twilio message sent");
    } catch (error) {
      console.error(
        "❌ Twilio error sending order notification:",
        error.message,
      );
    }
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res
      .status(500)
      .json({ message: "Server error creating order", error: err.message });
  }
});

/* ----------------------------------
   ✅ GET USER’S OWN ORDERS
---------------------------------- */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching my orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching user orders", error: err.message });
  }
});

/* ----------------------------------
   ✅ ADMIN — GET ALL ORDERS
---------------------------------- */
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title mainImage sizes")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching all orders", error: err.message });
  }
});

/* ----------------------------------
   ✅ ADMIN — UPDATE ORDER
---------------------------------- */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const allowedFields = ["status", "paymentStatus"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid update fields provided",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const allowedPaymentStatuses = ["Paid", "Cancelled"];

    if (
      updates.status !== undefined &&
      !allowedStatuses.includes(updates.status)
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    if (
      updates.paymentStatus !== undefined &&
      !allowedPaymentStatuses.includes(updates.paymentStatus)
    ) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err.message);
    res.status(500).json({ message: "Server error updating order" });
  }
});

/* ----------------------------------
   ✅ ADMIN — DELETE ORDER
---------------------------------- */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res
      .status(500)
      .json({ message: "Error deleting order", error: err.message });
  }
});

export default router;
