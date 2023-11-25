import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';

export interface ICompanyRepositoryGateway {
  create(props: CreateCompanyDto): Promise<CompanyEntity>;
  findAll(page?: number, pageSize?: number): Promise<CompanyEntity[]>;
  findOne(id: number): Promise<CompanyEntity>;
  findByCnpj(cnpj: string): Promise<CompanyEntity>;
  remove(id: number): Promise<{ id: number }>;
  update(id: number, data: UpdateCompanyDto): Promise<CompanyEntity>;
}
