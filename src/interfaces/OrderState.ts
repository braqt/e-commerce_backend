export enum OrderStateValue {
  PREPARED = "PREPARED",
  NOT_PREPARED = "NOT_PREPARED",
}

export interface OrderState {
  name: OrderStateValue;
}
