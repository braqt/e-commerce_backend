export enum PaymentStateValue {
  PAID = "PAID",
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
}

export interface PaymentState {
  name: PaymentStateValue;
}
