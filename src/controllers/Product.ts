import { UpdateQuery } from "mongoose";
import { Product } from "../interfaces/Product";
import ProductRepository from "../repositories/ProductRepository";

class ProductController {
  productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getProduct(id: string) {
    return this.productRepository.get(id);
  }

  async createProduct(product: Product) {
    return this.productRepository.create(product);
  }

  async updateProduct(id: string, query: UpdateQuery<Product>) {
    return this.productRepository.update(id, query);
  }
}

export default ProductController;
