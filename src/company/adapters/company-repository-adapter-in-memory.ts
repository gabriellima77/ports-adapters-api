import { Injectable } from '@nestjs/common';
import { ICompanyRepositoryGateway } from '../gateway/company-repository-gateway-interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyRepositoryAdapterInMemory
  implements ICompanyRepositoryGateway
{
  companies: Company[] = [];

  async create(props: CreateCompanyDto): Promise<Company> {
    const newId = this.companies.length + 1;
    const company = new Company({
      ...props,
      id: newId,
    });

    this.companies.push(company);

    return company;
  }

  async findAll(page?: number, pageSize?: number): Promise<Company[]> {
    return this.companies;
  }

  async findOne(id: number): Promise<Company> {
    const company = this.companies.find((company) => company.id === id);

    return company;
  }

  async remove(id: number): Promise<{ id: number }> {
    this.companies = this.companies.filter((company) => company.id !== id);

    return { id };
  }

  async update(
    id: number,
    { cnpj, name, website }: UpdateCompanyDto,
  ): Promise<Company> {
    this.companies = this.companies.map((company) => {
      if (company.id === id) {
        return {
          id: company.id,
          cnpj: cnpj ?? company.cnpj,
          name: name ?? company.name,
          website: website ?? company.website,
        };
      }

      return company;
    });

    return await this.findOne(id);
  }
}
