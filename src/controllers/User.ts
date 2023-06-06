import { UpdateQuery } from "mongoose";
import { User } from "../interfaces/User";
import UserRepository from "../repositories/UserRepository";

class UserController {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUser(id: string) {
    return this.userRepository.get(id);
  }

  async createUser(user: User) {
    return this.userRepository.create(user);
  }

  async updateUser(id: string, query: UpdateQuery<User>) {
    return this.userRepository.update(id, query);
  }
}

export default UserController;
