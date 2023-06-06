import PaymentMethodRepository from "../repositories/PaymentMethodRepository";

class PaymentMethodController {
  paymentMethodRepository: PaymentMethodRepository;

  constructor(paymentMethodRepository: PaymentMethodRepository) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  async getPaymentMethods() {
    return this.paymentMethodRepository.get();
  }
}

export default PaymentMethodController;
