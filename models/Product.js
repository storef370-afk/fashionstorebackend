import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "clothes", "shoes", "kids"
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
