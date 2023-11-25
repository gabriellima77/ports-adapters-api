import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.model';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepositoryAdapterInMemory,
    {
      provide: 'UserRepositoryAdapterInMemory',
      useExisting: UserRepositoryAdapterInMemory,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
