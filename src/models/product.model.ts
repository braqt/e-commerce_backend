import { Schema, model } from "mongoose";

import { Product } from "../interfaces/Product";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    discountPercentage: { type: String, required: true, default: 0 },
    quantity: { type: Number, required: true },
    finalPrice: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<Product>("Product", ProductSchema);
