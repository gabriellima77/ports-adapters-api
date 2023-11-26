import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';
import { ICompanyRepositoryGateway } from '../gateway/company-repository-gateway-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company.model';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.model';
import { createCompanies } from '../../../utils/create-entities';
import { validateUpdateFields } from '../../../utils/validate-update-fields';

export class CompanyRepositoryAdapterTypeorm
  implements ICompanyRepositoryGateway
{
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create({ userId, ...props }: CreateCompanyDto): Promise<CompanyEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return;

    const newCompany = this.companyRepository.create({
      ...props,
      user,
    });
    await this.companyRepository.save(newCompany);
    const company = new CompanyEntity({ ...props, userId, id: newCompany.id });

    return company;
  }

  async findAll(page?: number, pageSize?: number): Promise<CompanyEntity[]> {
    const allCompanies = await this.companyRepository.find({
      skip: page * pageSize,
      take: pageSize,
      relations: {
        user: true,
      },
    });

    return createCompanies(allCompanies);
  }

  async findOne(id: number): Promise<CompanyEntity> {
    const hasCompany = await this.companyRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!hasCompany) return;

    const [company] = createCompanies([hasCompany]);

    return company;
  }

  async findByCnpj(cnpj: string): Promise<CompanyEntity> {
    const hasCompany = await this.companyRepository.findOne({
      where: { cnpj },
      relations: {
        user: true,
      },
    });

    if (!hasCompany) return;

    const [company] = createCompanies([hasCompany]);

    return company;
  }

  async remove(id: number): Promise<{ id: number }> {
    const hasCompany = await this.companyRepository.findOne({
      where: { id },
    });
    if (!hasCompany) return;

    await this.companyRepository.remove(hasCompany);

    return { id };
  }

  async update(id: number, data: UpdateCompanyDto): Promise<CompanyEntity> {
    const hasCompany = await this.companyRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!hasCompany) return;

    const dataToChange = validateUpdateFields<UpdateCompanyDto>(data, {});
    await this.companyRepository.update(id, dataToChange);
    const [company] = createCompanies([{ ...hasCompany, ...dataToChange }]);

    return company;
  }
}
