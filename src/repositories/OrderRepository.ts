import { FilterQuery, Types } from "mongoose";

import OrderModel from "../models/order.model";
import { Order } from "../interfaces/Order";
import UserRepository from "./UserRepository";

class OrderRepository {
  async getAllOrdersByCreationData() {
    return await OrderModel.find().sort({ _id: -1 });
  }

  async getOrderByOrderNumber(orderNumber: number) {
    return await OrderModel.findOne({ orderNumber: orderNumber });
  }

  async getOrders(
    pageNumber: number,
    pageSize: number,
    orderNumber?: string,
    clientName?: string
  ) {
    let query: FilterQuery<Order> = {};
    if (orderNumber) {
      query["orderNumber"] = orderNumber;
    }
    if (clientName) {
      const user = await new UserRepository().getUserByName(clientName);
      if (user) {
        query["user"] = user?._id;
      }
    }
    let orders = await OrderModel.find(query)
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return orders;
  }

  async getNumberOfOrders(orderNumber?: string, clientName?: string) {
    let query: FilterQuery<Order> = {};
    if (orderNumber) {
      query["orderNumber"] = orderNumber;
    }
    if (clientName) {
      const user = await new UserRepository().getUserByName(clientName);
      if (user) {
        query["user"] = user?._id;
      }
    }
    return await OrderModel.find(query).count();
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
