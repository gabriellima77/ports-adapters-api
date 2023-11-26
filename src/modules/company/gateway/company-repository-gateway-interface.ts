import { CreateCompanyDto } from '../dto/create-company.dto';
import { FindAllCompaniesDto } from '../dto/find-all-companies.dto';
import { FindOneCompanyDto } from '../dto/find-one-company.dto';
import { RemoveCompanyDto } from '../dto/remove-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';

export interface ICompanyRepositoryGateway {
  create(props: CreateCompanyDto): Promise<CompanyEntity>;
  findAll(props: FindAllCompaniesDto): Promise<CompanyEntity[]>;
  findOne(props: FindOneCompanyDto): Promise<CompanyEntity>;
  findByCnpj(cnpj: string, userId: number): Promise<CompanyEntity>;
  remove(props: RemoveCompanyDto): Promise<{ id: number }>;
  update(props: UpdateCompanyDto): Promise<CompanyEntity>;
}
