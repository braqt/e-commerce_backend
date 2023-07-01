import { Request, Response } from "express";

import { dollarsToCents } from "../helpers";
import { Product } from "../interfaces/Product";
import { IGetAuthTokenRequest } from "../middlewares/auth";
import ProductRepository from "../repositories/ProductRepository";
import StaticFileServerService from "../services/StaticFileServerService";

class ProductController {
  async createProduct(req: IGetAuthTokenRequest, res: Response) {
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
      try {
        const files = req.files as Express.Multer.File[];
        const staticFileServerService = new StaticFileServerService();
        if (!files || files.length === 0) {
          return res.status(400).json({ message: "No images received." });
        }
        const priceInCents = dollarsToCents(price);
        let imagesBuffer = files.map((file) => file.buffer);
        let response = await staticFileServerService.uploadImages(imagesBuffer);
        let imagesUrl = response.imagesUrl;
        let finalPriceInCents =
          priceInCents - (priceInCents * discountPercentage) / 100;

        let product: Product = {
          name,
          description,
          imagesUrl,
          category,
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

  async getProduct(req: Request, res: Response) {
    const { idProduct } = req.body;
    if (idProduct) {
      try {
        const product = await new ProductRepository().getProductById(idProduct);
        if (product) {
          res.json(product);
        } else {
          console.error("No Product found with the id: " + idProduct);
          res.sendStatus(500);
        }
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async getProducts(req: Request, res: Response) {
    const { pageNumber, pageSize, productName, category } = req.body;
    if (pageNumber && pageSize) {
      try {
        const products = await new ProductRepository().getProducts(
          pageNumber,
          pageSize,
          productName,
          category
        );
        const numberOfProducts =
          await new ProductRepository().getNumberOfProducts(
            productName,
            category
          );
        let pageNumberLimit = Math.ceil(numberOfProducts / pageSize);
        res.json({
          applicants: products,
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

export default ProductController;
