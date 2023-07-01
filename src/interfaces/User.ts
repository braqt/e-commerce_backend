export interface User {
  name: string;
  lastName: string;
  phone: number;
  dni: number;
  email: string;
  firebaseAuthID: string;
  emailVerified: boolean;
  isAdmin: boolean;
}
