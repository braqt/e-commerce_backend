import { Request, Response } from "express";

import ProductRepository from "../repositories/ProductRepository";

class ProductController {
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

export default ProductController;
