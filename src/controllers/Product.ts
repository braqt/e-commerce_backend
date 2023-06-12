import { Request, Response } from "express";

import { Product } from "../interfaces/Product";
import ProductRepository from "../repositories/ProductRepository";
import StaticFileServerService from "../services/StaticFileServerService";

class ProductController {
  async createProduct(req: Request, res: Response) {
    const { name, description, category, price, discountPercentage, quantity } =
      req.body;
    if (
      name &&
      description &&
      category &&
      price &&
      discountPercentage &&
      quantity
    ) {
      const files = req.files as Express.Multer.File[];
      const staticFileServerService = new StaticFileServerService();
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images received." });
      }

      let imagesBuffer = files.map((file) => file.buffer);
      let response = await staticFileServerService.uploadImages(imagesBuffer);
      let imagesUrl = response.imagesUrl;
      let finalPrice = (price - (price * discountPercentage) / 100).toString();

      let product: Product = {
        name,
        description,
        imagesUrl,
        category,
        price,
        discountPercentage: +discountPercentage,
        quantity: +quantity,
        finalPrice,
      };

      new ProductRepository().create(product);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }
}

export default ProductController;
