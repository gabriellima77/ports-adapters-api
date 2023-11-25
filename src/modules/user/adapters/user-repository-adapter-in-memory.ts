import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { IUserRepositoryGateway } from '../gateway/user-repository-gateway-interface';
import { CompanyEntity } from '../../company/entities/company.entity';

@Injectable()
export class UserRepositoryAdapterInMemory implements IUserRepositoryGateway {
  users: UserEntity[] = [
    {
      companies: [],
      email: 'teste69@gmail.com',
      id: 1,
      name: 'Julian HOHO',
      password: 'senha teste',
    },
  ];

  async create(props: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const id = this.users.length + 1;
    const newUser = new UserEntity({
      ...props,
      id,
    });
    this.users.push(newUser);

    return newUser;
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const hasUser = await this.findOne(id);
    if (!hasUser) {
      throw new Error('User not found');
    }

    this.users = this.users.map((user) => {
      if (user.id === id) {
        const { name, password } = data;

        return {
          ...user,
          name: name ?? user.name,
          password: password ?? user.password,
        };
      }

      return user;
    });

    return await this.findOne(id);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  async findOne(userId: number): Promise<UserEntity> {
    const user = this.users.find(({ id }) => id === userId);
    return user;
  }

  async remove(userId: number): Promise<{ id: number }> {
    const userExists = await this.findOne(userId);
    if (!userExists) return;

    this.users = this.users.filter((user) => user.id !== userExists.id);
    return { id: userId };
  }

  async findByEmail(userEmail: string): Promise<UserEntity> {
    const user = this.users.find(({ email }) => email === userEmail);
    return user;
  }

  async addCompanyToUser(
    userId: number,
    company: CompanyEntity,
  ): Promise<UserEntity> {
    const userIndex = this.users.findIndex(({ id }) => id === userId);
    if (userIndex === -1) return;

    const user = this.users[userIndex];
    const hasCompany = user.companies.some(({ id }) => company.id === id);
    if (hasCompany) return;

    this.users[userIndex].companies.push(company);

    return this.users[userIndex];
  }
}
