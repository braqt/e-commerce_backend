import { getAuth } from "firebase-admin/auth";
import { PaymentMethodValue } from "../interfaces/PaymentMethod";
import { PaymentStateValue } from "../interfaces/PaymentState";
import { OrderStateValue } from "../interfaces/OrderState";

export const getFirebaseAuthenticationUID = async (
  firebaseAuthenticationToken: string
) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(
      firebaseAuthenticationToken
    );
    return decodedToken.uid;
  } catch (e) {
    console.error(e);
  }
};

export const dollarsToCents = (value: number) => {
  return value * 1000;
};

export const centsToDollar = (value: number) => {
  return value / 1000;
};

export const stringToPaymentMethod = (paymentMethod: string) => {
  if (paymentMethod == PaymentMethodValue.CASH) {
    return PaymentMethodValue.CASH;
  } else {
    throw Error("Payment Method Not Supported");
  }
};

export const isPaymentState = (value: string) => {
  return value == PaymentStateValue.PAID || value == PaymentMethodValue.CASH;
};
export const isOrderState = (value: string) => {
  return (
    value == OrderStateValue.PREPARED ||
    value == OrderStateValue.NOT_PREPARED ||
    value == OrderStateValue.COMPLETED ||
    value == OrderStateValue.NOT_COMPLETED
  );
};
