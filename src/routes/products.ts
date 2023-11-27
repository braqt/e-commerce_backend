import { Router } from "express";
import ProductController from "../controllers/Product";
import { checkRateLimit } from "../middlewares/rateLimit";

const router = Router();
const productController = new ProductController();

router.post("/getProduct", checkRateLimit, productController.getProduct);
router.post("/getProducts", checkRateLimit, productController.getProducts);

export default router;
