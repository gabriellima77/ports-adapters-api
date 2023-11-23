import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';

export interface ICompanyRepositoryGateway {
  create(props: CreateCompanyDto): Promise<Company>;
  findAll(page?: number, pageSize?: number): Promise<Company[]>;
  findOne(id: number): Promise<Company>;
  remove(id: number): Promise<{ id: number }>;
  update(id: number, data: UpdateCompanyDto): Promise<Company>;
}
