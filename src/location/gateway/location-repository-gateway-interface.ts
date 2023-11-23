import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { Location } from '../entities/location.entity';

export interface ILocationRepositoryGateway {
  create(props: CreateLocationDto): Promise<Location>;
  findAll(page?: number, pageSize?: number): Promise<Location[]>;
  findOne(id: number): Promise<Location>;
  remove(id: number): Promise<{ id: number }>;
  update(id: number, props: UpdateLocationDto): Promise<Location>;
}
