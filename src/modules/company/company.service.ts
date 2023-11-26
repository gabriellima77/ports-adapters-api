import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ICompanyRepositoryGateway } from './gateway/company-repository-gateway-interface';
import { FindAllCompaniesDto } from './dto/find-all-companies.dto';
import { FindOneCompanyDto } from './dto/find-one-company.dto';
import { RemoveCompanyDto } from './dto/remove-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('CompanyRepositoryAdapterTypeorm')
    readonly companyRepository: ICompanyRepositoryGateway,
  ) {}

  private async validateCnpj(cnpj: string, userId: number) {
    const companyAlreadyExists = await this.companyRepository.findByCnpj(
      cnpj,
      userId,
    );
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
    const { valid, message } = await this.validateCnpj(cnpj, rest.userId);

    if (!valid) {
      throw new BadRequestException(message);
    }

    return this.companyRepository.create({
      ...rest,
      cnpj: cnpj.trim(),
    });
  }

  async findAll(props: FindAllCompaniesDto) {
    return await this.companyRepository.findAll(props);
  }

  findOne(props: FindOneCompanyDto) {
    return this.companyRepository.findOne(props);
  }

  async update({
    id,
    userId,
    dataToUpdate: { cnpj, ...rest },
  }: UpdateCompanyDto) {
    if (cnpj) {
      const { valid, message } = await this.validateCnpj(cnpj, userId);

      if (!valid) {
        throw new BadRequestException(message);
      }
    }

    return this.companyRepository.update({
      id,
      userId,
      dataToUpdate: { ...rest, cnpj },
    });
  }

  remove(props: RemoveCompanyDto) {
    return this.companyRepository.remove(props);
  }
}
