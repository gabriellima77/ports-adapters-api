import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepositoryGateway } from './gateway/user-repository-gateway-interface';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryAdapterInMemory')
    readonly userRepository: IUserRepositoryGateway,
    @Inject()
    readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findByEmail(createUserDto.email);
    if (user) {
      throw new Error('This email is already in use by another user');
    }
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.remove(id);
  }

  async singIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email or password is invalid');
    }

    if (user.password !== password) {
      throw new Error('Email or password is invalid');
    }

    const payload: PayloadDto = {
      email: user.email,
      name: user.name,
      sub: user.id,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    return { access_token };
  }
}
