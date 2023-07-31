import { Types } from "mongoose";
import { User } from "./User";
import { OrderState } from "./OrderState";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentState } from "./PaymentState";

export interface Order {
  orderNumber: number;
  totalInCents: number;
  user: Types.ObjectId | User;
  products: {
    id: Types.ObjectId;
    quantity: number;
  }[];
  state: Types.ObjectId | OrderState;
  paymentMethod: Types.ObjectId | PaymentMethod;
  paymentState: Types.ObjectId | PaymentState;
  createdAt?: string;
}
