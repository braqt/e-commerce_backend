import { Router } from "express";

import UserController from "../controllers/User";
import { checkIfAuthenticated } from "../middlewares/auth";

const router = Router();
const userController = new UserController();

//@ts-ignore
router.post("/createUser", checkIfAuthenticated, userController.createUser);
router.post(
  "/getUser",
  //@ts-ignore
  checkIfAuthenticated,
  userController.getUser
);
router.post(
  "/activeOrders",
  //@ts-ignore
  checkIfAuthenticated,
  userController.getActiveOrders
);
router.post(
  "/inactiveOrders",
  //@ts-ignore
  checkIfAuthenticated,
  userController.getInactiveOrders
);

export default router;
