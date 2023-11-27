import { Router } from "express";

import { checkIfAuthenticated } from "../middlewares/auth";
import { checkRateLimit } from "../middlewares/rateLimit";

import OrderController from "../controllers/Order";

const router = Router();
const orderController = new OrderController();

router.post(
  "/createOrder",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  orderController.createOrder
);

export default router;
