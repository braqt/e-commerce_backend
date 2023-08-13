import ProductModel from "../models/product.model";
import { Product } from "../interfaces/Product";
import { FilterQuery } from "mongoose";

class ProductRepository {
  async getProductById(id: string) {
    return await ProductModel.findById(id).select(
      "-_id -__v -createdAt -updatedAt"
    );
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

  async getProducts(
    pageNumber: number,
    pageSize: number,
    productName?: string,
    category?: string
  ) {
    let query: FilterQuery<Product> = {};
    if (productName) {
      query["name"] = { $regex: ".*" + productName + ".*", $options: "i" };
    }
    if (category) {
      query["category"] = category;
    }
    let products = await ProductModel.find(query)
      .select("-__v -createdAt -updatedAt")
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return products;
  }

  async getAdminProducts(
    pageNumber: number,
    pageSize: number,
    productName?: string,
    category?: string
  ) {
    let query: FilterQuery<Product> = {};
    if (productName) {
      query["name"] = { $regex: ".*" + productName + ".*", $options: "i" };
    }
    if (category) {
      query["category"] = category;
    }
    let products = await ProductModel.find(query)
      .select("-__v -updatedAt")
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return products;
  }

  async getNumberOfProducts(productName?: string, category?: string) {
    let query: FilterQuery<Product> = {};
    if (productName) {
      query["name"] = { $regex: ".*" + productName + ".*" };
    }
    if (category) {
      query["category"] = category;
    }
    return await ProductModel.find(query).count();
  }
}

export default ProductRepository;
