import { Response } from "express";

import { User } from "../interfaces/User";
import UserRepository from "../repositories/UserRepository";
import { IGetAuthTokenRequest } from "../middlewares/auth";

class UserController {
  async createUser(req: IGetAuthTokenRequest, res: Response) {
    const { name, lastName, phone, dni, email } = req.body;
    if (lastName && phone && dni && email) {
      const firebaseAuthID = req.authId;

      const user: User = {
        name,
        lastName,
        phone,
        dni,
        email,
        firebaseAuthID,
        emailVerified: false,
        isAdmin: false,
      };

      await new UserRepository().create(user);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }

  async setUserAsAdmin(req: IGetAuthTokenRequest, res: Response) {
    const { userAuthID } = req.body;
    const maxNumberOfAdminUsers = 4;
    const numberOfAdminUsers =
      await new UserRepository().getNumberOfAdminUsers();

    if (numberOfAdminUsers > 0 && numberOfAdminUsers <= maxNumberOfAdminUsers) {
      await new UserRepository().setUserAsAdmin(userAuthID);
      res.sendStatus(200);
    } else {
      console.error(
        "Max number of admin users reached: " + maxNumberOfAdminUsers
      );
      res.sendStatus(500);
    }
  }

  async getUserByFirebaseAuthID(req: IGetAuthTokenRequest, res: Response) {
    const { authId } = req;
    try {
      const user = await new UserRepository().getUserByFirebaseAuthID(authId);
      if (user) {
        res.json(user);
      } else {
        throw new Error("No user found with the firebaseAuthID " + authId);
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}

export default UserController;
