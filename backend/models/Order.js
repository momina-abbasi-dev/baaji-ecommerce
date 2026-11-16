import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        size: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Bank Transfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Awaiting Proof",
        "Pending Verification",
        "Paid",
        "Cancelled",
      ],
      default: "Pending",
    },

    transactionId: { type: String },
    paymentProof: { type: String },
    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
