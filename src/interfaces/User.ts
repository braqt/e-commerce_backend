export interface User {
  name: string;
  lastName: string;
  phone: number;
  dni: number;
  email: string;
  hashedAndSaltedPassword: string;
  emailVerified: boolean;
}
