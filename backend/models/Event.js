import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL or local
    date: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;