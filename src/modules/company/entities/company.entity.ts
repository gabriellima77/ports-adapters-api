import { Location } from 'src/modules/location/entities/location.entity';

export class Company {
  id: number;
  name: string;
  cnpj: string;
  website?: string;
  locations?: Location[];
  userId: number;

  constructor({ website, ...rest }: Company) {
    Object.assign(this, rest);
    this.locations = [];

    if (website) {
      this.website = website;
    }
  }
}
