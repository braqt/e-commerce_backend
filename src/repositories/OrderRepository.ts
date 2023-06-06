import { UpdateQuery } from "mongoose";

import OrderModel from "../models/order.model";
import { Order } from "../interfaces/Order";

class OrderRepository {
  async get(id: string) {
    return await OrderModel.findById(id);
  }

  async create(order: Order) {
    return await OrderModel.create(order);
  }

  async update(id: string, query: UpdateQuery<Order>) {
    return await OrderModel.findByIdAndUpdate(id, query, { new: true });
  }
}

export default OrderRepository;
