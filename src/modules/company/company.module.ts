import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepositoryAdapterInMemory } from './adapters/company-repository-adapter-in-memory';
import { UserRepositoryAdapterInMemory } from '../user/adapters/user-repository-adapter-in-memory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.model';
import { User } from '../user/entities/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepositoryAdapterInMemory,
    UserRepositoryAdapterInMemory,
    {
      provide: 'CompanyRepositoryAdapterInMemory',
      useExisting: CompanyRepositoryAdapterInMemory,
    },
    {
      provide: 'UserRepositoryAdapterInMemory',
      useExisting: UserRepositoryAdapterInMemory,
    },
  ],
})
export class CompanyModule {}
