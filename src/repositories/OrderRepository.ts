import { FilterQuery, Types } from "mongoose";

import OrderModel from "../models/order.model";
import { Order } from "../interfaces/Order";
import { OrderStateValue } from "../interfaces/OrderState";
import UserRepository from "./UserRepository";
import OrderStateRepository from "./OrderStateRepository";

class OrderRepository {
  async getAllOrdersByCreationData() {
    return await OrderModel.find().sort({ _id: -1 });
  }

  async getOrderByOrderNumber(orderNumber: number) {
    return await OrderModel.findOne({ orderNumber: orderNumber });
  }

  async getOrderByOrderNumberWithSelectedValues(orderNumber: number) {
    return await OrderModel.findOne({ orderNumber: orderNumber })
      .populate(
        "user",
        "-_id name lastName phone dni email emailVerified createdAt"
      )
      .populate(
        "products.id",
        "-_id name imagesUrl category priceInCents discountPercentage quantity finalPriceInCents"
      )
      .populate("paymentState")
      .populate("paymentMethod")
      .populate("state")
      .exec();
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
      .select("-products -updatedAt -__v")
      .populate(
        "user",
        "-_id name lastName phone dni email emailVerified createdAt"
      )
      .populate("paymentState")
      .populate("paymentMethod")
      .populate("state")
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return orders;
  }

  async getUserActiveOrders(
    userId: string,
    pageNumber: number,
    pageSize: number
  ) {
    const orderStatePrepared =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.PREPARED
      );
    const orderStateNotPrepared =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.NOT_PREPARED
      );
    if (orderStatePrepared && orderStateNotPrepared) {
      let orders = await OrderModel.find({
        user: new Types.ObjectId(userId),
        $or: [
          { state: orderStatePrepared._id },
          { state: orderStateNotPrepared._id },
        ],
      })
        .populate("paymentState")
        .populate("paymentMethod")
        .populate("state")
        .select("-_id -user -updatedAt -__v")
        .sort({ _id: -1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize);

      return orders;
    } else {
      throw new Error(
        "OrderState Prepared not found or/and OrderState Not Prepared not found"
      );
    }
  }

  async getNumberOfUserActiveOrders(userId: string) {
    const orderStatePrepared =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.PREPARED
      );
    const orderStateNotPrepared =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.NOT_PREPARED
      );
    if (orderStatePrepared && orderStateNotPrepared) {
      let numberOfActiveOrders = await OrderModel.find({
        user: new Types.ObjectId(userId),
        $or: [
          { state: orderStatePrepared._id },
          { state: orderStateNotPrepared._id },
        ],
      }).count();

      return numberOfActiveOrders;
    } else {
      throw new Error(
        "OrderState Prepared not found or/and OrderState Not Prepared not found"
      );
    }
  }

  async getUserCompletedOrders(
    userId: string,
    pageNumber: number,
    pageSize: number
  ) {
    const orderStateCompleted =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.COMPLETED
      );
    if (orderStateCompleted) {
      let orders = await OrderModel.find({
        user: new Types.ObjectId(userId),
        state: orderStateCompleted._id,
      })
        .populate("paymentState")
        .populate("paymentMethod")
        .populate("state")
        .select("-_id -user -updatedAt -__v")
        .sort({ _id: -1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize);

      return orders;
    } else {
      throw new Error(
        "OrderState Completed not found or/and OrderState Not Completed not found"
      );
    }
  }

  async getUserNotCompletedOrders(
    userId: string,
    pageNumber: number,
    pageSize: number
  ) {
    const orderStateNotCompleted =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.NOT_COMPLETED
      );
    if (orderStateNotCompleted) {
      let orders = await OrderModel.find({
        user: new Types.ObjectId(userId),
        state: orderStateNotCompleted._id,
      })
        .populate("paymentState")
        .populate("paymentMethod")
        .populate("state")
        .select("-_id -user -updatedAt -__v")
        .sort({ _id: -1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize);

      return orders;
    } else {
      throw new Error(
        "OrderState Completed not found or/and OrderState Not Completed not found"
      );
    }
  }

  async getNumberOfUserInactiveOrders(userId: string) {
    const orderStateCompleted =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.COMPLETED
      );
    const orderStateNotCompleted =
      await new OrderStateRepository().getOrderStateByName(
        OrderStateValue.NOT_COMPLETED
      );
    if (orderStateCompleted && orderStateNotCompleted) {
      let numberOfInactiveOrders = await OrderModel.find({
        user: new Types.ObjectId(userId),
        $or: [
          { state: orderStateCompleted._id },
          { state: orderStateNotCompleted._id },
        ],
      }).count();

      return numberOfInactiveOrders;
    } else {
      throw new Error(
        "OrderState Completed not found or/and OrderState Not Completed not found"
      );
    }
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

  async getUserOrdersForAdmin(
    pageNumber: number,
    pageSize: number,
    idUser: string
  ) {
    let orders = await OrderModel.find({ user: idUser })
      .select("-products -updatedAt -__v")
      .populate("paymentState")
      .populate("paymentMethod")
      .populate("state")
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return orders;
  }

  async getNumberOfUserOrdersForAdmin(idUser: string) {
    let orders = await OrderModel.find({ user: idUser }).count();

    return orders;
  }
}

export default OrderRepository;
