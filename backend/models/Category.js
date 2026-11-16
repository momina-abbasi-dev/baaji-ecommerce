import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    image: { type: String },                      // category banner/thumbnail
    isMenu: {
      type: Boolean,
      default: false // true if category should appear in Navbar menu
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;