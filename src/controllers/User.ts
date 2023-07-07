import { Request, Response } from "express";

import { User } from "../interfaces/User";
import { IGetAuthTokenRequest } from "../middlewares/auth";
import UserRepository from "../repositories/UserRepository";
import OrderRepository from "../repositories/OrderRepository";

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
        statistics: {
          numberOfCompletedOrders: 0,
          totalSpentInCents: 0,
        },
        emailVerified: false,
        isAdmin: false,
      };
      try {
        await new UserRepository().create(user);
        res.sendStatus(200);
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async setUserAsAdmin(req: Request, res: Response) {
    const { userAuthID } = req.body;
    if (userAuthID) {
      try {
        const maxNumberOfAdminUsers = 4;
        const numberOfAdminUsers =
          await new UserRepository().getNumberOfAdminUsers();

        if (
          numberOfAdminUsers > 0 &&
          numberOfAdminUsers <= maxNumberOfAdminUsers
        ) {
          await new UserRepository().setUserAsAdmin(userAuthID);
          res.sendStatus(200);
        } else {
          throw new Error(
            "Max number of admin users reached: " + maxNumberOfAdminUsers
          );
        }
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async getUser(req: IGetAuthTokenRequest, res: Response) {
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

  async getActiveOrders(req: IGetAuthTokenRequest, res: Response) {
    const { authId } = req;
    const { pageNumber, pageSize } = req.body;

    if (pageNumber && pageSize) {
      try {
        const user = await new UserRepository().getUserByFirebaseAuthID(authId);
        if (user) {
          const userId = user._id.toString();
          const activeOrders = await new OrderRepository().getUserActiveOrders(
            userId,
            pageNumber,
            pageSize
          );
          const numberOfActiveOrders =
            await new OrderRepository().getNumberOfUserActiveOrders(userId);
          let pageNumberLimit = Math.ceil(numberOfActiveOrders / pageSize);
          res.json({ activeOrders, pageNumberLimit });
        } else {
          throw new Error("No user found with the firebaseAuthID " + authId);
        }
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.status(400).send("Request needs the pageNumber or the pageSize");
    }
  }

  async getInactiveOrders(req: IGetAuthTokenRequest, res: Response) {
    const { authId } = req;
    const { pageNumber, pageSize } = req.body;

    if (pageNumber && pageSize) {
      try {
        const user = await new UserRepository().getUserByFirebaseAuthID(authId);
        if (user) {
          const userId = user._id.toString();
          const inactiveOrders =
            await new OrderRepository().getUserInactiveOrders(
              userId,
              pageNumber,
              pageSize
            );
          const numberOfInactiveOrders =
            await new OrderRepository().getNumberOfUserActiveOrders(userId);
          let pageNumberLimit = Math.ceil(numberOfInactiveOrders / pageSize);
          res.json({ inactiveOrders, pageNumberLimit });
        } else {
          throw new Error("No user found with the firebaseAuthID " + authId);
        }
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.status(400).send("Request needs the pageNumber or the pageSize");
    }
  }
}

export default UserController;
