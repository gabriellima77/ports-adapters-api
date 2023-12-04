import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { LocationEntity } from '../entities/location.entity';

export interface ILocationRepositoryGateway {
  create(props: CreateLocationDto): Promise<LocationEntity>;
  findAll(
    companyId: number,
    page?: number,
    pageSize?: number,
  ): Promise<LocationEntity[]>;
  findOne(id: number): Promise<LocationEntity>;
  remove(id: number): Promise<{ id: number }>;
  update(id: number, props: UpdateLocationDto): Promise<LocationEntity>;
}
