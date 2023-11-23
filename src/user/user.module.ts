import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepositoryAdapterInMemory,
    JwtModule,
    {
      provide: 'UserRepositoryAdapterInMemory',
      useValue: UserRepositoryAdapterInMemory,
    },
  ],
})
export class UserModule {}
