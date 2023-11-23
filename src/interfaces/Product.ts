export interface Product {
  name: string;
  description: string;
  imagesUrl: string[];
  priceInCents: number;
  discountPercentage: number;
  quantity: number;
  finalPriceInCents: number;
}
