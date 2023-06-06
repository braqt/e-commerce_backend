import { Schema, model } from "mongoose";

import { Order } from "../interfaces/Order";

const OrderSchema = new Schema(
  {
    orderNumber: { type: Number, required: true },
    total: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    state: { type: Schema.Types.ObjectId, ref: "State" },
    paymentMethod: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }],
    paymentState: [{ type: Schema.Types.ObjectId, ref: "PaymentState" }],
  },
  { timestamps: true }
);

export default model<Order>("Order", OrderSchema);
