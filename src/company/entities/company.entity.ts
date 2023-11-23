import { Location } from 'src/location/entities/location.entity';

export class Company {
  id: number;
  name: string;
  cnpj: string;
  website?: string;
  locations?: Location[];

  constructor({ website, ...rest }: Company) {
    Object.assign(this, rest);
    this.locations = [];

    if (website) {
      this.website = website;
    }
  }
}
