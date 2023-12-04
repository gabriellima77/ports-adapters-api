import { LocationEntity } from '../../location/entities/location.entity';

export class CompanyEntity {
  id: number;
  name: string;
  cnpj: string;
  website?: string;
  locations?: LocationEntity[];
  userId: number;

  constructor({ website, ...rest }: CompanyEntity) {
    Object.assign(this, rest);
    this.locations = rest.locations ?? [];

    if (website) {
      this.website = website;
    }
  }
}
