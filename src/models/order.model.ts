import { Schema, model } from "mongoose";

import { Order } from "../interfaces/Order";

const ProductsSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: String, require: true },
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: Number, required: true },
    totalInCents: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [ProductsSchema],
    state: { type: Schema.Types.ObjectId, ref: "OrderState" },
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    paymentState: { type: Schema.Types.ObjectId, ref: "PaymentState" },
  },
  { timestamps: true }
);

export default model<Order>("Order", OrderSchema);
