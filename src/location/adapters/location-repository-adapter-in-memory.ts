import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dto/create-location.dto';
import { Location } from '../entities/location.entity';
import { ILocationRepositoryGateway } from '../gateway/location-repository-gateway-interface';
import { UpdateLocationDto } from '../dto/update-location.dto';

@Injectable()
export class LocationRepositoryAdapterInMemory
  implements ILocationRepositoryGateway
{
  locations: Location[] = [];

  async create(props: CreateLocationDto): Promise<Location> {
    const newId = this.locations.length + 1;
    const location = new Location({
      ...props,
      id: newId,
    });

    this.locations.push(location);

    return location;
  }

  async findAll(page?: number, pageSize?: number): Promise<Location[]> {
    return this.locations;
  }

  async findOne(id: number): Promise<Location> {
    return this.locations.find((location) => location.id === id);
  }

  async remove(id: number): Promise<{ id: number }> {
    this.locations = this.locations.filter((location) => location.id !== id);

    return { id };
  }

  async update(id: number, props: UpdateLocationDto): Promise<Location> {
    this.locations = this.locations.map((location) => {
      if (location.id === id) {
        const updatedLocation = { ...location };
        Object.assign(updatedLocation, props);
        return updatedLocation;
      }

      return location;
    });

    return this.findOne(id);
  }
}
