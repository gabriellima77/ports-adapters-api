import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepositoryGateway } from './gateway/user-repository-gateway-interface';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryAdapterTypeorm')
    readonly userRepository: IUserRepositoryGateway,
    readonly jwtService: JwtService,
  ) {}

  async create({ password, ...rest }: CreateUserDto) {
    const user = await this.userRepository.findByEmail(rest.email);
    if (user) {
      throw new BadRequestException(
        'This email is already in use by another user',
      );
    }

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    return this.userRepository.create({
      ...rest,
      password: encryptedPassword,
    });
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, password } = updateUserDto;
    let newPassword: string | null = null;

    if (password) {
      const salt = await bcrypt.genSalt();
      newPassword = await bcrypt.hash(password, salt);
    }

    return this.userRepository.update(id, {
      ...updateUserDto,
      name,
      password: newPassword,
    });
  }

  remove(id: number) {
    return this.userRepository.remove(id);
  }

  async singIn(
    email: string,
    userPassword: string,
  ): Promise<{ access_token: string; name: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email or password is invalid');
    }

    const { password } = user;
    const isCorrectPassword = await bcrypt.compare(userPassword, password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Email or password is invalid');
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

    return { access_token, name: user.name };
  }
}
