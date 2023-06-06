import { UpdateQuery } from "mongoose";
import { OrderState } from "../interfaces/OrderState";
import OrderStateRepository from "../repositories/OrderStateRepository";

class OrderStateController {
  orderStateRepository: OrderStateRepository;

  constructor(productRepository: OrderStateRepository) {
    this.orderStateRepository = productRepository;
  }

  async getProduct(id: string) {
    return this.orderStateRepository.get(id);
  }

  async createProduct(product: OrderState) {
    return this.orderStateRepository.create(product);
  }

  async updateProduct(id: string, query: UpdateQuery<OrderState>) {
    return this.orderStateRepository.update(id, query);
  }
}

export default OrderStateController;
