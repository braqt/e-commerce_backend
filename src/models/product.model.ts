import { Schema, model } from "mongoose";

import { Product } from "../interfaces/Product";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagesUrl: [{ type: String, required: true }],
    priceInCents: { type: Number, required: true },
    discountPercentage: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true },
    finalPriceInCents: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<Product>("Product", ProductSchema);
