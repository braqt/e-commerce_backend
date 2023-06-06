import { Schema, model } from "mongoose";

import { PaymentMethod } from "../interfaces/PaymentMethod";

const PaymentMethodSchema = new Schema({
  name: { type: String, required: true },
});

export default model<PaymentMethod>("PaymentMethod", PaymentMethodSchema);
