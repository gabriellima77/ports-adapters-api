import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ICompanyRepositoryGateway } from './gateway/company-repository-gateway-interface';
import { LocationEntity } from '../location/entities/location.entity';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('CompanyRepositoryAdapterInMemory')
    readonly companyRepository: ICompanyRepositoryGateway,
  ) {}

  private async validateCnpj(cnpj: string) {
    const companyAlreadyExists = await this.companyRepository.findByCnpj(cnpj);
    if (companyAlreadyExists) {
      return { valid: false, message: 'Company already exists' };
    }

    const cnpjRegexp = new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/g);
    const isValidCnpj = cnpjRegexp.test(cnpj.trim());
    if (!isValidCnpj) {
      return { valid: false, message: 'Cnpj is invalid' };
    }

    return { valid: true, message: '' };
  }

  async create({ cnpj, ...rest }: CreateCompanyDto) {
    const { valid, message } = await this.validateCnpj(cnpj);

    if (!valid) {
      throw new BadRequestException(message);
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

  async update(id: number, { cnpj, ...rest }: UpdateCompanyDto) {
    if (cnpj) {
      const { valid, message } = await this.validateCnpj(cnpj);

      if (!valid) {
        throw new BadRequestException(message);
      }
    }

    return this.companyRepository.update(id, { ...rest, cnpj });
  }

  remove(id: number) {
    return this.companyRepository.remove(id);
  }

  addLocationToCompany(id: number, location: LocationEntity) {
    return this.companyRepository.addLocationToCompany(id, location);
  }
}
