import { Router } from "express";

import UserController from "../controllers/User";
import { checkIfAdmin, checkIfAuthenticated } from "../middlewares/auth";

const router = Router();
const userController = new UserController();

//@ts-ignore
router.post("/createUser", checkIfAuthenticated, userController.createUser);
//@ts-ignore
router.post("/s3tUs3r4s4dmin", checkIfAdmin, userController.setUserAsAdmin);
router.post(
  "/getUser",
  //@ts-ignore
  checkIfAuthenticated,
  userController.getUser
);

export default router;
