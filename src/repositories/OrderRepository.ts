import { Types } from "mongoose";

import OrderModel from "../models/order.model";
import { Order } from "../interfaces/Order";

class OrderRepository {
  async getAllOrdersByCreationData() {
    return await OrderModel.find().sort({ _id: -1 });
  }

  async getOrderByOrderNumber(orderNumber: number) {
    return await OrderModel.findOne({ orderNumber: orderNumber });
  }

  async setOrderState(orderNumber: number, idOrderState: string) {
    return await OrderModel.findOneAndUpdate(
      { orderNumber: orderNumber },
      { state: new Types.ObjectId(idOrderState) }
    );
  }

  async setPaymentState(orderNumber: number, idPaymentState: string) {
    return await OrderModel.findOneAndUpdate(
      { orderNumber: orderNumber },
      { paymentState: new Types.ObjectId(idPaymentState) }
    );
  }

  async create(order: Order) {
    return await OrderModel.create(order);
  }
}

export default OrderRepository;
