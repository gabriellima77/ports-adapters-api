import { BadRequestException } from '@nestjs/common';
import { CompanyRepositoryAdapterInMemory } from './adapters/company-repository-adapter-in-memory';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserRepositoryAdapterInMemory } from '../user/adapters/user-repository-adapter-in-memory';
import { UserEntity } from '../user/entities/user.entity';

describe('CompanyService', () => {
  let service: CompanyService;
  const userRepository = new UserRepositoryAdapterInMemory();
  let user: UserEntity;
  userRepository
    .create({
      companies: [],
      email: 'teste1@email.com',
      name: 'John Doe',
      password: '123456',
    })
    .then((response) => (user = response));

  beforeEach(() => {
    const repository = new CompanyRepositoryAdapterInMemory(userRepository);
    service = new CompanyService(repository);
  });

  it('should create a Company', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      userId: user.id,
    };
    const company = await service.create(data);

    expect(company.name).toEqual(data.name);
    expect(company.cnpj).toEqual(data.cnpj);
    expect(company.website).toEqual(data.website);
  });

  it('should not create a Company with a cnpj already in use', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: 'INVALID CNPJ',
      website: 'https://hublocal.com.br/',
      userId: user.id,
    };

    expect(service.create(data)).rejects.toBeInstanceOf(BadRequestException);
    expect(service.create(data)).rejects.toThrow();
  });

  it('should not create a Company with an invalid cnpj', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      userId: user.id,
    };

    await service.create(data);

    expect(service.create(data)).rejects.toBeInstanceOf(BadRequestException);
    expect(service.create(data)).rejects.toThrow();
  });

  it('should find all Companies', async () => {
    const data: CreateCompanyDto[] = [
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-19',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-18',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
    ];

    await Promise.all(data.map((company) => service.create(company)));

    const companies = await service.findAll();

    expect(companies).toHaveLength(3);
    expect(typeof companies[0].cnpj).toEqual('string');
    expect(typeof companies[1].cnpj).toEqual('string');
  });

  it('should find a Company', async () => {
    const data: CreateCompanyDto[] = [
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-19',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-18',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
    ];

    const companies = await Promise.all(
      data.map((company) => service.create(company)),
    );

    const company = await service.findOne(companies[0].id);

    expect(company).toBeTruthy();
    expect(company.id).toEqual(companies[0].id);
  });

  it('should remove Company', async () => {
    const data: CreateCompanyDto[] = [
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-19',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-18',
        website: 'https://hublocal.com.br/',
        userId: user.id,
      },
    ];

    const newCompanies = await Promise.all(
      data.map((company) => service.create(company)),
    );

    const { id } = await service.remove(newCompanies[1].id);
    const companies = await service.findAll();
    const removedCompany = await service.findOne(newCompanies[1].id);

    expect(companies).toHaveLength(2);
    expect(id).toEqual(newCompanies[1].id);
    expect(removedCompany).toBeFalsy();
  });

  it('should update Company', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      userId: user.id,
    };

    const newCompany = await service.create(data);
    const updateCompany = await service.update(newCompany.id, {
      name: 'New name',
      cnpj: '23.871.225/0001-20',
      website: 'https://newsite.com.br',
    });

    expect(updateCompany.id).toEqual(newCompany.id);
    expect(updateCompany.name).not.toEqual(data.name);
    expect(updateCompany.cnpj).not.toEqual(data.cnpj);
    expect(updateCompany.website).not.toEqual(data.website);

    expect(updateCompany.name).toEqual('New name');
    expect(updateCompany.cnpj).toEqual('23.871.225/0001-20');
    expect(updateCompany.website).toEqual('https://newsite.com.br');
  });

  it('should not update Company with an invalid cnpj', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      userId: user.id,
    };

    const newCompany = await service.create(data);

    expect(
      service.update(newCompany.id, {
        cnpj: '23.871.225/0001-20222',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(
      service.update(newCompany.id, {
        cnpj: '23.871.225/0001-20222',
      }),
    ).rejects.toThrow();
  });
});
