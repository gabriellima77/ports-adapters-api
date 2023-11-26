import { Injectable } from '@nestjs/common';
import { ICompanyRepositoryGateway } from '../gateway/company-repository-gateway-interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';

@Injectable()
export class CompanyRepositoryAdapterInMemory
  implements ICompanyRepositoryGateway
{
  companies: CompanyEntity[] = [];

  async create({ userId, ...props }: CreateCompanyDto): Promise<CompanyEntity> {
    const newId = this.companies.length + 1;
    const company = new CompanyEntity({
      ...props,
      id: newId,
      userId,
    });

    this.companies.push(company);

    return company;
  }

  async findAll(_page?: number, _pageSize?: number): Promise<CompanyEntity[]> {
    return this.companies;
  }

  async findOne(id: number): Promise<CompanyEntity> {
    const company = this.companies.find((company) => company.id === id);

    return company;
  }

  async findByCnpj(cnpj: string): Promise<CompanyEntity> {
    return this.companies.find((company) => company.cnpj === cnpj);
  }

  async remove(id: number): Promise<{ id: number }> {
    this.companies = this.companies.filter((company) => company.id !== id);

    return { id };
  }

  async update(
    id: number,
    { cnpj, name, website }: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    this.companies = this.companies.map((company) => {
      if (company.id === id) {
        return {
          ...company,
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
