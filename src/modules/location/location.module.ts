import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepositoryAdapterInMemory } from './adapters/location-repository-adapter-in-memory';
import { LocationRepositoryAdapterTypeorm } from './adapters/location-repository-adapter-typeorm';
import { CompanyRepositoryAdapterInMemory } from '../company/adapters/company-repository-adapter-in-memory';
import { UserRepositoryAdapterInMemory } from '../user/adapters/user-repository-adapter-in-memory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.model';
import { Company } from '../company/entities/company.model';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Company])],
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationRepositoryAdapterInMemory,
    LocationRepositoryAdapterTypeorm,
    CompanyRepositoryAdapterInMemory,
    UserRepositoryAdapterInMemory,
    {
      provide: 'LocationRepositoryAdapterInMemory',
      useExisting: LocationRepositoryAdapterInMemory,
    },
    {
      provide: 'LocationRepositoryAdapterTypeorm',
      useExisting: LocationRepositoryAdapterTypeorm,
    },
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
export class LocationModule {}
