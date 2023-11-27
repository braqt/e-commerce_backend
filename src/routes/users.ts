import { Router } from "express";

import UserController from "../controllers/User";
import { checkIfAuthenticated } from "../middlewares/auth";
import { checkRateLimit } from "../middlewares/rateLimit";

const router = Router();
const userController = new UserController();

router.post(
  "/createUser",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  userController.createUser
);
router.post(
  "/getUser",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  userController.getUser
);
router.post(
  "/activeOrders",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  userController.getActiveOrders
);
router.post(
  "/completedOrders",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  userController.getCompletedOrders
);
router.post(
  "/notCompletedOrders",
  //@ts-ignore
  [checkRateLimit, checkIfAuthenticated],
  userController.getNotCompletedOrders
);

export default router;
