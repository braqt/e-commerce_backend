export interface User {
  name: string;
  lastName: string;
  phone: number;
  dni: number;
  email: string;
  firebaseAuthID: string;
  statistics: UserStatistics;
  emailVerified: boolean;
  isAdmin: boolean;
}

export interface UserStatistics {
  totalSpentInCents: number;
  numberOfCompletedOrders: number;
  lastOrderCompletedDate?: Date;
}
