import { UpdateQuery } from "mongoose";

import UserModel from "../models/user.model";
import { User } from "../interfaces/User";

class UserRepository {
  async get(id: string) {
    return await UserModel.findById(id);
  }

  async create(product: User) {
    return await UserModel.create(product);
  }

  async update(id: string, query: UpdateQuery<User>) {
    return await UserModel.findByIdAndUpdate(id, query, { new: true });
  }
}

export default UserRepository;
