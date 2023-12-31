import { Repository } from 'typeorm';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { ILocationRepositoryGateway } from '../gateway/location-repository-gateway-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../company/entities/company.model';
import { Location } from '../entities/location.model';
import { validateUpdateFields } from '../../../utils/validate-update-fields';
import { createLocations } from '../../../utils/create-entities';

export class LocationRepositoryAdapterTypeorm
  implements ILocationRepositoryGateway
{
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create({
    companyId,
    ...props
  }: CreateLocationDto): Promise<LocationEntity> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) return;

    const newLocation = this.locationRepository.create({
      ...props,
      company,
    });
    await this.locationRepository.save(newLocation);
    const location = new LocationEntity({
      ...props,
      companyId,
      id: newLocation.id,
    });

    return location;
  }

  async findAll(
    companyId: number,
    page?: number,
    pageSize?: number,
  ): Promise<LocationEntity[]> {
    const allLocations = await this.locationRepository.find({
      where: {
        company: {
          id: companyId,
        },
      },
      skip: page * pageSize,
      take: pageSize,
      relations: {
        company: true,
      },
    });

    return createLocations(allLocations);
  }

  async findOne(id: number): Promise<LocationEntity> {
    const hasLocation = await this.locationRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!hasLocation) return;

    const [location] = createLocations([hasLocation]);

    return location;
  }

  async remove(id: number): Promise<{ id: number }> {
    const hasLocation = await this.locationRepository.findOne({
      where: { id },
    });

    if (!hasLocation) return;

    await this.locationRepository.remove(hasLocation);

    return { id };
  }

  async update(id: number, props: UpdateLocationDto): Promise<LocationEntity> {
    const hasLocation = await this.locationRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!hasLocation) return;
    const dataToChange = validateUpdateFields<UpdateLocationDto>(props, {});
    await this.locationRepository.update(id, dataToChange);
    const [location] = createLocations([
      {
        ...hasLocation,
        ...dataToChange,
      },
    ]);

    return location;
  }
}
