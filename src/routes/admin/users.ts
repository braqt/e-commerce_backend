import { Router } from "express";

import { checkIfAdmin } from "../../middlewares/auth";
import { checkRateLimit } from "../../middlewares/rateLimit";

import OrderController from "../../controllers/Order";
import UserController from "../../controllers/User";

const router = Router();
const userController = new UserController();
const orderController = new OrderController();

router.post(
  "/s3tUs3r4s4dmin",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  userController.setUserAsAdmin
);

router.post(
  "/getUsers",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  userController.getUsers
);

router.post(
  "/getUser",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  //@ts-ignore
  userController.getUserForAdmin
);

router.post(
  "/getOrders",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  orderController.getUserOrders
);

export default router;
