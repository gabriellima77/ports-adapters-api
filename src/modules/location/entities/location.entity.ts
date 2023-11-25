export class LocationEntity {
  id: number;
  name: string;
  cep: string;
  street: string;
  houseNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId: number;

  constructor(props: LocationEntity) {
    Object.assign(this, props);
  }
}
