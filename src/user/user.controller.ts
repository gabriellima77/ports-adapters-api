import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    readonly jwtService: JwtService,
  ) {}

  @Post('/')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string, @Request() request: any) {
    const { user }: { user: PayloadDto } = request;
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.sub !== Number(id)) {
      throw new UnauthorizedException();
    }

    return this.userService.remove(+id);
  }
}
