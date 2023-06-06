import { UpdateQuery } from "mongoose";

import ProductModel from "../models/product.model";
import { Product } from "../interfaces/Product";

class ProductRepository {
  async get(id: string) {
    return await ProductModel.findById(id);
  }

  async create(product: Product) {
    return await ProductModel.create(product);
  }

  async update(id: string, query: UpdateQuery<Product>) {
    return await ProductModel.findByIdAndUpdate(id, query, { new: true });
  }
}

export default ProductRepository;
