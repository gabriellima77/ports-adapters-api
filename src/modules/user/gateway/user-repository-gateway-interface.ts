import { Company } from '../../company/entities/company.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserRepositoryGateway {
  create(props: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  remove(id: number): Promise<{ id: number }>;
  findByEmail(email: string): Promise<User>;
  update(id: number, data: UpdateUserDto): Promise<User>;
  addCompanyToUser(userId: number, company: Company): Promise<User>;
}
