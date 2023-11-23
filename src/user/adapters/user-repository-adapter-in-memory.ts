import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepositoryGateway } from '../gateway/user-repository-gateway-interface';

@Injectable()
export class UserRepositoryAdapterInMemory implements IUserRepositoryGateway {
  users: User[] = [];

  async create(props: Omit<User, 'id'>): Promise<User> {
    const id = this.users.length + 1;
    const newUser = new User({
      ...props,
      id,
    });
    this.users.push(newUser);

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(userId: number): Promise<User> {
    const user = this.users.find(({ id }) => id === userId);
    return user;
  }

  async remove(userId: number): Promise<{ id: number }> {
    const userExists = await this.findOne(userId);
    if (!userExists) return;

    this.users = this.users.filter((user) => user.id !== userExists.id);
    return { id: userId };
  }

  async findByEmail(userEmail: string): Promise<User> {
    const user = this.users.find(({ email }) => email === userEmail);
    return user;
  }
}
