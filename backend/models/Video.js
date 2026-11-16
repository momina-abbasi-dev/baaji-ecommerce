import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary or local URL
});

export default mongoose.model("Video", videoSchema);