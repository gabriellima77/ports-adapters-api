import { Location } from 'src/modules/location/entities/location.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';

export interface ICompanyRepositoryGateway {
  create(props: CreateCompanyDto): Promise<Company>;
  findAll(page?: number, pageSize?: number): Promise<Company[]>;
  findOne(id: number): Promise<Company>;
  findByCnpj(cnpj: string): Promise<Company>;
  remove(id: number): Promise<{ id: number }>;
  update(id: number, data: UpdateCompanyDto): Promise<Company>;
  addLocationToCompany(id: number, location: Location): Promise<Company>;
}
