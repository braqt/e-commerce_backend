export enum OrderStateValue {
  PREPARED = "PREPARED",
  NOT_PREPARED = "NOT_PREPARED",
  COMPLETED = "COMPLETED",
  NOT_COMPLETED = "NOT_COMPLETED",
}

export interface OrderState {
  name: OrderStateValue;
}
