import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepositoryGateway {
  create(props: CreateUserDto): Promise<UserEntity>;
  findAll(): Promise<Omit<UserEntity, 'password'>[]>;
  findOne(id: number): Promise<Omit<UserEntity, 'password'>>;
  remove(id: number): Promise<{ id: number }>;
  findByEmail(email: string): Promise<UserEntity>;
  update(
    id: number,
    data: UpdateUserDto,
  ): Promise<Omit<UserEntity, 'password'>>;
}
