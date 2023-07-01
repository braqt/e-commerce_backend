import { NextFunction, Request, Response } from "express";

import { getAuth } from "firebase-admin/auth";
import UserRepository from "../repositories/UserRepository";

export interface IGetAuthTokenRequest extends Request {
  authToken: string;
  authId: string;
}

const getAuthToken = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    return res
      .status(400)
      .send({ error: "You are not authorized to make this request" });
  }
  next();
};

export const checkIfAuthenticated = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await getAuth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      console.error(e);
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};

export const checkIfAdmin = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  //solo van a existir un numero pequeño de cuentas admin y no se podran crear mas
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const decodedToken = await getAuth().verifyIdToken(authToken);
      const firebaseAuthID = decodedToken.uid;
      const user = await new UserRepository().getUserByFirebaseAuthID(
        firebaseAuthID
      );
      if (user) {
        if (user.isAdmin === true) {
          req.authId = firebaseAuthID;
          return next();
        } else {
          throw new Error(
            "User with the authToken " + authToken + " is not admin:"
          );
        }
      } else {
        throw new Error("No User found with the token:" + authToken);
      }
    } catch (e) {
      console.error(e);
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};
