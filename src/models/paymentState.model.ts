import { Schema, model } from "mongoose";

import { PaymentState } from "../interfaces/PaymentState";

const PaymentStateSchema = new Schema({
  name: { type: String, required: true },
});

export default model<PaymentState>("PaymentState", PaymentStateSchema);
