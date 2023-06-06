import PaymentMethodModel from "../models/paymentMethod.model";

class PaymentMethodRepository {
  async get() {
    return await PaymentMethodModel.find();
  }
}

export default PaymentMethodRepository;
