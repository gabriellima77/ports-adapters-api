import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepositoryAdapterInMemory } from './adapters/company-repository-adapter-in-memory';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepositoryAdapterInMemory,
    {
      provide: 'CompanyRepositoryAdapterInMemory',
      useValue: CompanyRepositoryAdapterInMemory,
    },
  ],
})
export class CompanyModule {}
