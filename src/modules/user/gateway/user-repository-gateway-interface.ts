import { CompanyEntity } from '../../company/entities/company.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepositoryGateway {
  create(props: CreateUserDto): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findOne(id: number): Promise<UserEntity>;
  remove(id: number): Promise<{ id: number }>;
  findByEmail(email: string): Promise<UserEntity>;
  update(id: number, data: UpdateUserDto): Promise<UserEntity>;
  addCompanyToUser(userId: number, company: CompanyEntity): Promise<UserEntity>;
}
