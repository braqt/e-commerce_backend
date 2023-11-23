import { Request, Response } from "express";

import { dollarsToCents } from "../helpers";
import { Product } from "../interfaces/Product";
import { IGetAuthTokenRequest } from "../middlewares/auth";
import ProductRepository from "../repositories/ProductRepository";
import StaticFileServerService from "../services/StaticFileServerService";

class AdminController {
  async createProduct(req: IGetAuthTokenRequest, res: Response) {
    const { name, description, price, discountPercentage, quantity } = req.body;
    if (name && description && price && discountPercentage && quantity) {
      try {
        const files = req.files as Express.Multer.File[];
        const staticFileServerService = new StaticFileServerService();
        if (!files || files.length === 0) {
          return res.status(400).json({ message: "No images received." });
        }
        const priceInCents = dollarsToCents(price);
        let imagesBuffer = files.map((file) => file.buffer);
        let imagesUrl = await staticFileServerService.uploadImages(
          imagesBuffer
        );
        let finalPriceInCents =
          priceInCents - (priceInCents * discountPercentage) / 100;

        let product: Product = {
          name,
          description,
          imagesUrl,
          priceInCents,
          discountPercentage: +discountPercentage,
          quantity: +quantity,
          finalPriceInCents,
        };

        new ProductRepository().create(product);
        res.sendStatus(200);
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async getProducts(req: Request, res: Response) {
    const { pageNumber, pageSize, productName } = req.body;
    if (pageNumber && pageSize) {
      try {
        const products = await new ProductRepository().getAdminProducts(
          pageNumber,
          pageSize,
          productName
        );
        const numberOfProducts =
          await new ProductRepository().getNumberOfProducts(productName);
        let pageNumberLimit = Math.ceil(numberOfProducts / pageSize);
        res.json({
          products: products,
          pageNumberLimit,
        });
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.status(400).send("Request needs the pageNumber or the pageSize");
    }
  }
}

export default AdminController;
