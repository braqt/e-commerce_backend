import OrderStateModel from "../models/orderState.model";

class OrderStateRepository {
  async getOrderStateByName(name: string) {
    return await OrderStateModel.findOne({ name: name });
  }
}

export default OrderStateRepository;
