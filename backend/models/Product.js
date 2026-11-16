import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    shortDesc: { type: String },
    description: { type: String },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    sizeDesc: { type: String },
    mainImage: { type: String },
    images: [{ type: String }],
    category: { type: String, required: true },
    shipping: { type: String },
    isTrend: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);