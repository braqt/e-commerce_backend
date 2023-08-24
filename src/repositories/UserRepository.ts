import UserModel from "../models/user.model";
import { User, UserStatistics } from "../interfaces/User";
import { FilterQuery } from "mongoose";

class UserRepository {
  async create(user: User) {
    return await UserModel.create(user);
  }

  async getUserByID(id: string) {
    return await UserModel.findById(id).select(
      "-_id -firebaseAuthID -statistics._id -isAdmin -updatedAt -__v"
    );
  }

  async getUserByFirebaseAuthID(firebaseAuthID: string) {
    return await UserModel.findOne({ firebaseAuthID: firebaseAuthID }).select(
      "-updatedAt -statistics._id -__v"
    );
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

  async getUsers(pageNumber: number, pageSize: number, name?: string) {
    let query: FilterQuery<User> = {};

    if (name) {
      query = {
        $or: [
          { name: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ],
      };
    }

    let users = await UserModel.find(query)
      .select(
        "-statistics._id -firebaseAuthID -isAdmin -emailVerified -__v -createdAt -updatedAt"
      )
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    return users;
  }

  async getNumberOfUsers(name?: string) {
    let query: FilterQuery<User> = {};

    if (name) {
      query = {
        $or: [
          { name: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ],
      };
    }

    return UserModel.find(query).count();
  }
}

export default UserRepository;
