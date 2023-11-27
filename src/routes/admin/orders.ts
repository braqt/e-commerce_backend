import { Router } from "express";

import { checkIfAdmin } from "../../middlewares/auth";
import { checkRateLimit } from "../../middlewares/rateLimit";
import OrderController from "../../controllers/Order";

const router = Router();
const orderController = new OrderController();

router.post(
  "/setOrderState",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  orderController.setOrderState
);

router.post(
  "/setPaymentState",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  orderController.setPaymentState
);

router.get(
  "/getOrder",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  orderController.getOrder
);
router.post(
  "/getOrders",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  orderController.getOrders
);

export default router;
