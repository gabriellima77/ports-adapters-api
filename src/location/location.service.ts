import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ILocationRepositoryGateway } from './gateway/location-repository-gateway-interface';

@Injectable()
export class LocationService {
  constructor(
    @Inject('LocationRepositoryAdapterInMemory')
    readonly locationRepository: ILocationRepositoryGateway,
  ) {}

  async create({ cep, ...rest }: CreateLocationDto) {
    const regexp = new RegExp(/^\d{5}-\d{3}$/g);
    const isValidCep = regexp.test(cep);

    if (!isValidCep) {
      throw new BadRequestException('Cep is not valid');
    }

    return this.locationRepository.create({ ...rest, cep });
  }

  findAll() {
    return this.locationRepository.findAll();
  }

  findOne(id: number) {
    return this.locationRepository.findOne(id);
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository.update(id, updateLocationDto);
  }

  remove(id: number) {
    return this.locationRepository.remove(id);
  }
}
