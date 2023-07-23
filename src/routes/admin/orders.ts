import { Router } from "express";
import OrderController from "../../controllers/Order";
import { checkIfAdmin } from "../../middlewares/auth";

const router = Router();
const orderController = new OrderController();

//@ts-ignore
router.post("/setOrderState", checkIfAdmin, orderController.setOrderState);
//@ts-ignore
router.post("/setPaymentState", checkIfAdmin, orderController.setPaymentState);
//@ts-ignore
router.get("/getOrder", checkIfAdmin, orderController.getOrder);
//@ts-ignore
router.post("/getOrders", checkIfAdmin, orderController.getOrders);

export default router;
