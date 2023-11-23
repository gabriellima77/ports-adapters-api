import { User } from '../entities/user.entity';

export interface IUserRepositoryGateway {
  create(props: Omit<User, 'id'>): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  remove(id: number): Promise<{ id: number }>;
  findByEmail(email: string): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
}
