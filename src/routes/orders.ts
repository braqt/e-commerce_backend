import { Router } from "express";

import OrderController from "../controllers/Order";
import { checkIfAdmin, checkIfAuthenticated } from "../middlewares/auth";

const router = Router();
const orderController = new OrderController();

//@ts-ignore
router.post("/createOrder", checkIfAuthenticated, orderController.createOrder);
//@ts-ignore
router.post("/setOrderState", checkIfAdmin, orderController.setOrderState);
//@ts-ignore
router.post("/setPaymentState", checkIfAdmin, orderController.setPaymentState);
router.get("/getOrder", orderController.getOrder);
router.post("/getOrders", orderController.getOrders);

export default router;
