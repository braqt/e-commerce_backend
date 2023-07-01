import UserModel from "../models/user.model";
import { User } from "../interfaces/User";

class UserRepository {
  async create(product: User) {
    return await UserModel.create(product);
  }

  async getUserByFirebaseAuthID(firebaseAuthID: string) {
    return await UserModel.findOne({ firebaseAuthID: firebaseAuthID });
  }

  async getUserByFirebaseAuthIDWithStatistics(firebaseAuthID: string) {
    return await UserModel.findOne({ firebaseAuthID: firebaseAuthID });
  }

  async getUserByName(name: string) {
    return await UserModel.findOne({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ],
    });
  }

  async setUserAsAdmin(firebaseAuthID: string) {
    return await UserModel.findOneAndUpdate(
      { firebaseAuthID: firebaseAuthID },
      { isAdmin: true }
    );
  }

  async getNumberOfAdminUsers() {
    return UserModel.find({ isAdmin: true }).count();
  }
}

export default UserRepository;
