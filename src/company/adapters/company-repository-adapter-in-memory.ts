import { Injectable } from '@nestjs/common';
import { ICompanyRepositoryGateway } from '../gateway/company-repository-gateway-interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';
import { Location } from 'src/location/entities/location.entity';

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

  async findByCnpj(cnpj: string): Promise<Company> {
    return this.companies.find((company) => company.cnpj === cnpj);
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
          locations: company.locations,
        };
      }

      return company;
    });

    return await this.findOne(id);
  }

  async addLocationToCompany(id: number, location: Location): Promise<Company> {
    const companyIndex = this.companies.findIndex(
      (company) => id === company.id,
    );
    if (companyIndex === -1) return;

    const company = this.companies[companyIndex];
    const hasLocation = company.locations.some(({ id }) => company.id === id);
    if (hasLocation) return;

    this.companies[companyIndex].locations.push(location);

    return this.companies[companyIndex];
  }
}
