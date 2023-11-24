import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
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
