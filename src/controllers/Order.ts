import { UpdateQuery } from "mongoose";
import { Order } from "../interfaces/Order";
import OrderRepository from "../repositories/OrderRepository";

class OrderController {
  orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrder(id: string) {
    return this.orderRepository.get(id);
  }

  async createOrder(order: Order) {
    return this.orderRepository.create(order);
  }

  async updateOrder(id: string, query: UpdateQuery<Order>) {
    return this.orderRepository.update(id, query);
  }
}

export default OrderController;
