import ProductModel from "../models/product.model";
import { Product } from "../interfaces/Product";

class ProductRepository {
  async getProductById(id: string) {
    return await ProductModel.findById(id);
  }

  async create(product: Product) {
    return await ProductModel.create(product);
  }

  async reduceQuantity(id: string, numberToReduce: number) {
    const product = await ProductModel.findById(id);
    if (product) {
      await ProductModel.findByIdAndUpdate(id, {
        quantity: product.quantity - numberToReduce,
      });
    } else {
      throw new Error("No product found with the _id: " + id);
    }
  }
}

export default ProductRepository;
