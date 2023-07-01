export interface UploadImagesResponse {
  imagesUrl: string[];
}

export interface CreateOrderBody {
  products: [
    {
      id: string;
      quantity: number;
    }
  ];
  paymentMethod: string;
}
