import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  create(@Body() { email, password }: LoginDto) {
    return this.userService.singIn(email, password);
  }
}
