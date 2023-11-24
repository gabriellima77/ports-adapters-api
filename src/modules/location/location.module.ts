import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepositoryAdapterInMemory } from './adapters/location-repository-adapter-in-memory';
import { CompanyRepositoryAdapterInMemory } from '../company/adapters/company-repository-adapter-in-memory';
import { UserRepositoryAdapterInMemory } from '../user/adapters/user-repository-adapter-in-memory';

@Module({
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationRepositoryAdapterInMemory,
    CompanyRepositoryAdapterInMemory,
    UserRepositoryAdapterInMemory,
    {
      provide: 'LocationRepositoryAdapterInMemory',
      useExisting: LocationRepositoryAdapterInMemory,
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
