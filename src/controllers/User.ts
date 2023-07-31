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

          if (activeOrders.length > 0) {
            let products: any[] = [];
            for (let i = 0; i < activeOrders.length; i++) {
              let activeOrder = activeOrders[i];
              for (let p of activeOrder.products) {
                products.push({
                  item: p.id,
                  quantity: p.quantity,
                });
              }
              let parsedActiveOrder = {
                orderNumber: activeOrder.orderNumber,
                paymentMethod: activeOrder.paymentMethod.name,
                paymentState: activeOrder.paymentState.name,
                state: activeOrder.state.name,
                totalInCents: activeOrder.totalInCents,
                user: activeOrder.user,
                createdAt: activeOrder.createdAt,
                products,
              };
              activeOrders[i] = parsedActiveOrder;
            }
          }
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

  async getCompletedOrders(req: IGetAuthTokenRequest, res: Response) {
    const { authId } = req;
    const { pageNumber, pageSize } = req.body;

    if (pageNumber && pageSize) {
      try {
        const user = await new UserRepository().getUserByFirebaseAuthID(authId);
        if (user) {
          const userId = user._id.toString();
          const completedOrders =
            await new OrderRepository().getUserCompletedOrders(
              userId,
              pageNumber,
              pageSize
            );

          if (completedOrders.length > 0) {
            let products: any[] = [];
            for (let i = 0; i < completedOrders.length; i++) {
              let completedOrder = completedOrders[i];
              for (let p of completedOrder.products) {
                products.push({
                  item: p.id,
                  quantity: p.quantity,
                });
              }
              7;
              let parsedCompletedOrder = {
                orderNumber: completedOrder.orderNumber,
                paymentMethod: completedOrder.paymentMethod.name,
                paymentState: completedOrder.paymentState.name,
                state: completedOrder.state.name,
                totalInCents: completedOrder.totalInCents,
                user: completedOrder.user,
                createdAt: completedOrder.createdAt,
                products,
              };
              completedOrders[i] = parsedCompletedOrder;
            }
          }
          const numberOfCompletedOrders =
            await new OrderRepository().getNumberOfUserInactiveOrders(userId);
          let pageNumberLimit = Math.ceil(numberOfCompletedOrders / pageSize);
          res.json({ completedOrders, pageNumberLimit });
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

  async getNotCompletedOrders(req: IGetAuthTokenRequest, res: Response) {
    const { authId } = req;
    const { pageNumber, pageSize } = req.body;

    if (pageNumber && pageSize) {
      try {
        const user = await new UserRepository().getUserByFirebaseAuthID(authId);
        if (user) {
          const userId = user._id.toString();
          const notCompletedOrders =
            await new OrderRepository().getUserNotCompletedOrders(
              userId,
              pageNumber,
              pageSize
            );

          if (notCompletedOrders.length > 0) {
            let products: any[] = [];
            for (let i = 0; i < notCompletedOrders.length; i++) {
              let notCompletedOrder = notCompletedOrders[i];
              for (let p of notCompletedOrder.products) {
                products.push({
                  item: p.id,
                  quantity: p.quantity,
                });
              }
              let parsedNotCompletedOrder = {
                orderNumber: notCompletedOrder.orderNumber,
                paymentMethod: notCompletedOrder.paymentMethod.name,
                paymentState: notCompletedOrder.paymentState.name,
                state: notCompletedOrder.state.name,
                totalInCents: notCompletedOrder.totalInCents,
                user: notCompletedOrder.user,
                createdAt: notCompletedOrder.createdAt,
                products,
              };
              notCompletedOrders[i] = parsedNotCompletedOrder;
            }
          }
          const numberOfNotCompletedOrders =
            await new OrderRepository().getNumberOfUserInactiveOrders(userId);
          let pageNumberLimit = Math.ceil(
            numberOfNotCompletedOrders / pageSize
          );
          res.json({ notCompletedOrders, pageNumberLimit });
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
