import { UpdateQuery } from "mongoose";

import OrderStateModel from "../models/orderState.model";
import { OrderState } from "../interfaces/OrderState";

class OrderStateRepository {
  async get(id: string) {
    return await OrderStateModel.findById(id);
  }

  async create(product: OrderState) {
    return await OrderStateModel.create(product);
  }

  async update(id: string, query: UpdateQuery<OrderState>) {
    return await OrderStateModel.findByIdAndUpdate(id, query, { new: true });
  }
}

export default OrderStateRepository;
