import { Types, Document } from "mongoose";
import { Product } from "./Product";
import { User } from "./User";
import { OrderState } from "./OrderState";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentState } from "./PaymentState";

export interface Order {
  orderNumber: number;
  total: string;
  user: Types.ObjectId | User;
  products: Types.ObjectId[] | Product[];
  state: Types.ObjectId | OrderState;
  paymentMethod: Types.ObjectId | PaymentMethod;
  paymentState: Types.ObjectId | PaymentState;
}
