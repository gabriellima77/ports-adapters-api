import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dto/create-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { ILocationRepositoryGateway } from '../gateway/location-repository-gateway-interface';
import { UpdateLocationDto } from '../dto/update-location.dto';

@Injectable()
export class LocationRepositoryAdapterInMemory
  implements ILocationRepositoryGateway
{
  locations: LocationEntity[] = [];

  async create({
    companyId,
    ...props
  }: CreateLocationDto): Promise<LocationEntity> {
    const newId = this.locations.length + 1;
    const location = new LocationEntity({
      ...props,
      id: newId,
      companyId,
    });

    this.locations.push(location);

    return location;
  }

  async findAll(
    _companyId: number,
    _page?: number,
    _pageSize?: number,
  ): Promise<LocationEntity[]> {
    return this.locations;
  }

  async findOne(id: number): Promise<LocationEntity> {
    return this.locations.find((location) => location.id === id);
  }

  async remove(id: number): Promise<{ id: number }> {
    this.locations = this.locations.filter((location) => location.id !== id);

    return { id };
  }

  async update(id: number, props: UpdateLocationDto): Promise<LocationEntity> {
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
