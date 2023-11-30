import { Schema, model } from "mongoose";

import { User } from "../interfaces/User";

const UserStatisticsSchema = new Schema({
  totalSpentInCents: { type: Number, required: true },
  numberOfCompletedOrders: { type: Number, required: true },
  lastOrderCompletedDate: { type: Date },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    dni: { type: String, required: true },
    email: { type: String, required: true },
    firebaseAuthID: { type: String, required: true },
    statistics: UserStatisticsSchema,
    isAdmin: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default model<User>("User", UserSchema);
