import { Router } from "express";

import OrderController from "../controllers/Order";
import { checkIfAuthenticated } from "../middlewares/auth";

const router = Router();
const orderController = new OrderController();

//@ts-ignore
router.post("/createOrder", checkIfAuthenticated, orderController.createOrder);

export default router;
