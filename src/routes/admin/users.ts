import { Router } from "express";
import UserController from "../../controllers/User";
import { checkIfAdmin } from "../../middlewares/auth";

const router = Router();
const userController = new UserController();

//@ts-ignore
router.post("/s3tUs3r4s4dmin", checkIfAdmin, userController.setUserAsAdmin);
//@ts-ignore
router.post("/getUsers", checkIfAdmin, userController.getUsers);

export default router;
