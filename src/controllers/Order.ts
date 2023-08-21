import { Types } from "mongoose";
import { Request, Response } from "express";

import { Order } from "../interfaces/Order";
import OrderRepository from "../repositories/OrderRepository";
import UserRepository from "../repositories/UserRepository";
import OrderStateRepository from "../repositories/OrderStateRepository";
import PaymentMethodRepository from "../repositories/PaymentMethodRepository";
import PaymentStateRepository from "../repositories/PaymentStateRepository";
import {
  isOrderState,
  isPaymentState,
  stringToPaymentMethod,
} from "../helpers";
import { CreateOrderBody } from "../interfaces/Api";
import ProductRepository from "../repositories/ProductRepository";
import { OrderStateValue } from "../interfaces/OrderState";
import { PaymentStateValue } from "../interfaces/PaymentState";
import { IGetAuthTokenRequest } from "../middlewares/auth";

class OrderController {
  async createOrder(req: IGetAuthTokenRequest, res: Response) {
    const { products, paymentMethod } = req.body as CreateOrderBody;

    if (products.length > 0 && paymentMethod) {
      const firebaseAuthID = req.authId;
      try {
        const userDoc = await new UserRepository().getUserByFirebaseAuthID(
          firebaseAuthID
        );
        if (userDoc) {
          const orders =
            await new OrderRepository().getAllOrdersByCreationData();
          let totalInCents = 0;
          for (let product of products) {
            const productRetrieved =
              await new ProductRepository().getProductById(product.id);
            if (productRetrieved) {
              totalInCents =
                totalInCents +
                productRetrieved.finalPriceInCents * product.quantity;
            } else {
              throw new Error("Product not found. id: " + product.id);
            }
          }

          const orderStateDoc =
            await new OrderStateRepository().getOrderStateByName(
              OrderStateValue.NOT_PREPARED
            );
          const paymentMethodDoc =
            await new PaymentMethodRepository().getPaymentMethodByName(
              stringToPaymentMethod(paymentMethod)
            );
          const paymentStateDoc =
            await new PaymentStateRepository().getPaymentStateByName(
              PaymentStateValue.WAITING_FOR_PAYMENT
            );

          let parsedProducts = [];
          for (let product of products) {
            parsedProducts.push({
              id: new Types.ObjectId(product.id),
              quantity: product.quantity,
            });
          }

          if (orderStateDoc && paymentMethodDoc && paymentStateDoc) {
            let order: Order = {
              orderNumber: orders.length == 0 ? 1 : orders[0].orderNumber + 1,
              totalInCents,
              products: parsedProducts,
              user: userDoc._id,
              state: orderStateDoc._id,
              paymentMethod: paymentMethodDoc._id,
              paymentState: paymentStateDoc._id,
            };
            new OrderRepository().create(order);
            for (let product of products) {
              new ProductRepository().reduceQuantity(
                product.id,
                product.quantity
              );
            }

            res.sendStatus(200);
          } else {
            throw new Error(
              "One or more docs werent found" +
                "orderStateDoc: " +
                orderStateDoc +
                ". paymentMethodDoc: " +
                paymentMethodDoc +
                ". paymentStateDoc:" +
                paymentStateDoc
            );
          }
        } else {
          throw new Error("User not found. firebaseAuthID:" + firebaseAuthID);
        }
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async getOrder(req: Request, res: Response) {
    const { orderNumber } = req.query;
    if (orderNumber) {
      const order =
        await new OrderRepository().getOrderByOrderNumberWithSelectedValues(
          +orderNumber
        );
      if (order) {
        let products: any[] = [];
        for (let p of order.products) {
          products.push({
            item: p.id,
            quantity: p.quantity,
          });
        }
        let orderResponse = {
          orderNumber: order.orderNumber,
          paymentMethod: order.paymentMethod.name,
          paymentState: order.paymentState.name,
          state: order.state.name,
          totalInCents: order.totalInCents,
          user: order.user,
          createdAt: order.createdAt,
          products,
        };
        res.json(orderResponse);
      } else {
        console.error("No Order found with the orderNumber: " + orderNumber);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async getOrders(req: Request, res: Response) {
    const { pageNumber, pageSize, orderNumber, clientName } = req.body;
    if (pageNumber && pageSize) {
      try {
        const orders = await new OrderRepository().getOrders(
          pageNumber,
          pageSize,
          orderNumber,
          clientName
        );
        const numberOfProducts = await new OrderRepository().getNumberOfOrders(
          orderNumber,
          clientName
        );
        const ordersResponse = [];
        for (let i = 0; i < orders.length; i++) {
          ordersResponse.push({
            _id: orders[i]._id,
            orderNumber: orders[i].orderNumber,
            totalInCents: orders[i].totalInCents,
            user: orders[i].user,
            paymentMethod: orders[i].paymentMethod.name,
            paymentState: orders[i].paymentState.name,
            state: orders[i].state.name,
            createdAt: orders[i].createdAt,
          });
        }
        const pageNumberLimit = Math.ceil(numberOfProducts / pageSize);
        res.json({
          orders: ordersResponse,
          pageNumberLimit,
        });
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async setOrderState(req: IGetAuthTokenRequest, res: Response) {
    const { orderNumber, orderStateValue } = req.body;
    const firebaseAuthID = req.authId;
    if (isOrderState(orderStateValue)) {
      try {
        const orderRepository = new OrderRepository();
        const userRepository = new UserRepository();
        const userDoc = await new UserRepository().getUserByFirebaseAuthID(
          firebaseAuthID
        );
        if (userDoc) {
          const order = await new OrderRepository().getOrderByOrderNumber(
            orderNumber
          );
          if (orderStateValue == OrderStateValue.COMPLETED) {
            if (order) {
              const orderStatePrepared =
                await new OrderStateRepository().getOrderStateByName(
                  OrderStateValue.PREPARED
                );
              const paymentStatePayed =
                await new PaymentStateRepository().getPaymentStateByName(
                  PaymentStateValue.PAID
                );
              if (orderStatePrepared && paymentStatePayed) {
                if (
                  order.state.toString() != orderStatePrepared._id.toString() &&
                  order.paymentState.toString() !=
                    paymentStatePayed._id.toString()
                ) {
                  throw new Error(
                    `The Order is not ${OrderStateValue.PREPARED} or ${PaymentStateValue.PAID}`
                  );
                }
              } else {
                throw new Error(
                  `The Order State 
                    ${OrderStateValue.PREPARED} or The Payment State 
                    ${PaymentStateValue.PAID} 
                    doesnt exists`
                );
              }
            } else {
              throw new Error(
                "User not found with firebaseAuthID: " + firebaseAuthID
              );
            }
          }
          const orderState =
            await new OrderStateRepository().getOrderStateByName(
              orderStateValue
            );
          if (orderState) {
            await orderRepository.setOrderState(
              orderNumber,
              orderState._id.toString()
            );
            if (orderState.name == OrderStateValue.COMPLETED && order) {
              await userRepository.updateUserStatistic(userDoc._id.toString(), {
                lastOrderCompletedDate: new Date(),
                numberOfCompletedOrders:
                  userDoc.statistics.numberOfCompletedOrders + 1,
                totalSpentInCents:
                  userDoc.statistics.totalSpentInCents + order.totalInCents,
              });
            }

            res.sendStatus(200);
          } else {
            console.error(
              "No Order State found with the name: " + orderStateValue
            );
            res.sendStatus(500);
          }
        } else {
          console.error("No User found with the uid: " + firebaseAuthID);
          res.sendStatus(500);
        }
      } catch (e) {
        console.error("Error updating Order: " + e);
        res.sendStatus(500);
      }
    } else {
      console.error("Order State not valid");
      res.sendStatus(500);
    }
  }

  async setPaymentState(req: IGetAuthTokenRequest, res: Response) {
    const { orderNumber, paymentStateValue } = req.body;
    const firebaseAuthID = req.authId;
    if (isPaymentState(paymentStateValue)) {
      try {
        const orderRepository = new OrderRepository();
        const userDoc = await new UserRepository().getUserByFirebaseAuthID(
          firebaseAuthID
        );
        if (userDoc) {
          const paymentState =
            await new PaymentStateRepository().getPaymentStateByName(
              paymentStateValue
            );
          if (paymentState) {
            await orderRepository.setPaymentState(
              orderNumber,
              paymentState._id.toString()
            );
            res.sendStatus(200);
          } else {
            console.error(
              "No Order State found with the name: " + paymentStateValue
            );
            res.sendStatus(500);
          }
        } else {
          console.error("No User found with the uid: " + firebaseAuthID);
          res.sendStatus(500);
        }
      } catch (e) {
        console.error("Error updating Order: " + e);
        res.sendStatus(500);
      }
    } else {
      console.error("Payment State not valid");
      res.sendStatus(500);
    }
  }
}

export default OrderController;
