import { CompanyEntity } from '../../company/entities/company.entity';

export class UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  companies: CompanyEntity[];

  constructor({ email, name, password, id }: UserEntity) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.id = id;
    this.companies = [];
  }
}
