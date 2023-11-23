import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepositoryAdapterInMemory } from './adapters/location-repository-adapter-in-memory';

@Module({
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationRepositoryAdapterInMemory,
    {
      provide: 'LocationRepositoryAdapterInMemory',
      useValue: LocationRepositoryAdapterInMemory,
    },
  ],
})
export class LocationModule {}
