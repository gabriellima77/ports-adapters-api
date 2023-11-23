import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ICompanyRepositoryGateway } from './gateway/company-repository-gateway-interface';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('CompanyRepositoryAdapterInMemory')
    readonly companyRepository: ICompanyRepositoryGateway,
  ) {}

  async create({ cnpj, ...rest }: CreateCompanyDto) {
    const companyAlreadyExists = await this.companyRepository.findByCnpj(cnpj);
    if (companyAlreadyExists) {
      throw new BadRequestException('Company already exists');
    }

    const cnpjRegexp = new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/g);
    const isValidCnpj = cnpjRegexp.test(cnpj.trim());
    if (!isValidCnpj) {
      throw new BadRequestException('Cnpj is invalid');
    }

    return this.companyRepository.create({
      ...rest,
      cnpj: cnpj.trim(),
    });
  }

  async findAll(page = 0, pageSize = 10) {
    return await this.companyRepository.findAll(page, pageSize);
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

  addLocationToCompany(id: number, location: Location) {
    return this.companyRepository.addLocationToCompany(id, location);
  }
}
