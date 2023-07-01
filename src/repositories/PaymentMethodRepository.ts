import PaymentMethodModel from "../models/paymentMethod.model";

class PaymentMethodRepository {
  async getPaymentMethodByName(name: string) {
    return await PaymentMethodModel.findOne({ name: name });
  }
}

export default PaymentMethodRepository;
