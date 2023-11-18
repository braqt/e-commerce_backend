export interface CreateOrderBody {
  products: [
    {
      id: string;
      quantity: number;
    }
  ];
  paymentMethod: string;
}
