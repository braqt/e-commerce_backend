import { Schema, model } from "mongoose";

import { OrderState } from "../interfaces/OrderState";

const OrderStateSchema = new Schema({
  name: { type: String, required: true },
});

export default model<OrderState>("OrderState", OrderStateSchema);
