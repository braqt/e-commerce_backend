import { Router } from "express";
import UserController from "../../controllers/User";
import { checkIfAdmin } from "../../middlewares/auth";
import OrderController from "../../controllers/Order";

const router = Router();
const userController = new UserController();
const orderController = new OrderController();

//@ts-ignore
router.post("/s3tUs3r4s4dmin", checkIfAdmin, userController.setUserAsAdmin);
//@ts-ignore
router.post("/getUsers", checkIfAdmin, userController.getUsers);
//@ts-ignore
router.post("/getUser", checkIfAdmin, userController.getUserForAdmin);
//@ts-ignore
router.post("/getOrders", checkIfAdmin, orderController.getUserOrders);

export default router;
