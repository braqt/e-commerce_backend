import { Schema, model } from "mongoose";

import { User } from "../interfaces/User";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    dni: { type: Number, required: true },
    email: { type: String, required: true },
    firebaseAuthID: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    emailVerified: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default model<User>("User", UserSchema);
