export class Location {
  id: number;
  name: string;
  cep: string;
  street: string;
  houseNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId: number;

  constructor(props: Location) {
    Object.assign(this, props);
  }
}
