export class Company {
  id: number;
  name: string;
  cnpj: string;
  website?: string;

  constructor({ website, ...rest }: Company) {
    Object.assign(this, rest);

    if (website) {
      this.website = website;
    }
  }
}
