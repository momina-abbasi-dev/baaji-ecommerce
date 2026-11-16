import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  images: [{ type: String, required: true }], // Array of banner image URLs
});

export default mongoose.model("Banner", bannerSchema);