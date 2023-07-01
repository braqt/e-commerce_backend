import PaymentStateModel from "../models/paymentState.model";

class PaymentStateRepository {
  async getPaymentStateByName(name: string) {
    return await PaymentStateModel.findOne({ name: name });
  }
}

export default PaymentStateRepository;
