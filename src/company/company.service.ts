import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ICompanyRepositoryGateway } from './gateway/company-repository-gateway-interface';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('CompanyRepositoryAdapterInMemory')
    readonly companyRepository: ICompanyRepositoryGateway,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.companyRepository.create(createCompanyDto);
  }

  findAll(page = 0, pageSize = 10) {
    return this.companyRepository.findAll(page, pageSize);
  }

  findOne(id: number) {
    return this.companyRepository.findOne(id);
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return this.companyRepository.update(id, updateCompanyDto);
  }

  remove(id: number) {
    return this.companyRepository.remove(id);
  }
}