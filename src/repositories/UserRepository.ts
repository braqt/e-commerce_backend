import UserModel from "../models/user.model";
import { User, UserStatistics } from "../interfaces/User";

class UserRepository {
  async create(user: User) {
    return await UserModel.create(user);
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

  async updateUserStatistic(userId: string, userStatistics: UserStatistics) {
    return UserModel.findByIdAndUpdate(userId, {
      statistics: userStatistics,
    });
  }
}

export default UserRepository;
