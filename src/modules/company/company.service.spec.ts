import { BadRequestException } from '@nestjs/common';
import { CompanyRepositoryAdapterInMemory } from './adapters/company-repository-adapter-in-memory';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { fail } from 'assert';

describe('CompanyService', () => {
  let service: CompanyService;
  const data: CreateCompanyDto[] = [
    {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      userId: 1,
    },
    {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-18',
      website: 'https://hublocal.com.br/',
      userId: 1,
    },
  ];
  beforeEach(() => {
    const repository = new CompanyRepositoryAdapterInMemory();
    service = new CompanyService(repository);
  });

  it('should create a Company', async () => {
    try {
      const company = await service.create(data[0]);

      expect(company.name).toEqual(data[0].name);
      expect(company.cnpj).toEqual(data[0].cnpj);
      expect(company.website).toEqual(data[0].website);

      await service.remove({
        id: company.id,
        userId: 1,
      });
    } catch (error) {
      fail(error.message);
    }
  });

  it('should not create a Company with a cnpj already in use', async () => {
    try {
      const cnpj = 'INVALID CNPJ';

      expect(service.create({ ...data[0], cnpj })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(service.create({ ...data[0], cnpj })).rejects.toThrow();
    } catch (error) {
      fail(error.message);
    }
  });

  it('should not create a Company with an invalid cnpj', async () => {
    try {
      const company = await service.create(data[0]);

      expect(service.create(data[0])).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(service.create(data[0])).rejects.toThrow();
      await service.remove({
        id: company.id,
        userId: 1,
      });
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find all Companies', async () => {
    try {
      await Promise.all(data.map((company) => service.create(company)));

      const companies = await service.findAll({
        page: 0,
        pageSize: 10,
        userId: 1,
      });

      expect(companies).toHaveLength(2);
      expect(typeof companies[0].cnpj).toEqual('string');
      expect(typeof companies[1].cnpj).toEqual('string');
      await Promise.all(
        companies.map(({ id }) =>
          service.remove({
            id,
            userId: 1,
          }),
        ),
      );
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find a Company', async () => {
    try {
      const companies = await Promise.all(
        data.map((company) => service.create(company)),
      );

      const company = await service.findOne({
        id: companies[0].id,
        userId: 1,
      });

      expect(company).toBeTruthy();
      expect(company.id).toEqual(companies[0].id);
      await Promise.all(
        companies.map(({ id }) =>
          service.remove({
            id,
            userId: 1,
          }),
        ),
      );
    } catch (error) {
      fail(error.message);
    }
  });

  it('should remove Company', async () => {
    try {
      const newCompanies = await Promise.all(
        data.map((company) => service.create(company)),
      );

      const { id } = await service.remove({
        id: newCompanies[1].id,
        userId: 1,
      });
      const companies = await service.findAll({
        userId: 1,
        page: 0,
        pageSize: 10,
      });
      const removedCompany = await service.findOne({
        id: newCompanies[1].id,
        userId: 1,
      });

      expect(companies).toHaveLength(1);
      expect(id).toEqual(newCompanies[1].id);
      expect(removedCompany).toBeFalsy();
      await Promise.all(
        companies.map(({ id }) =>
          service.remove({
            id,
            userId: 1,
          }),
        ),
      );
    } catch (error) {
      fail(error.message);
    }
  });

  it('should update Company', async () => {
    try {
      const newCompany = await service.create(data[0]);
      const updateCompany = await service.update({
        id: newCompany.id,
        userId: 1,
        dataToUpdate: {
          name: 'New name',
          cnpj: '23.871.225/0001-20',
          website: 'https://newsite.com.br',
        },
      });

      expect(updateCompany.id).toEqual(newCompany.id);
      expect(updateCompany.name).not.toEqual(data[0].name);
      expect(updateCompany.cnpj).not.toEqual(data[0].cnpj);
      expect(updateCompany.website).not.toEqual(data[0].website);

      expect(updateCompany.name).toEqual('New name');
      expect(updateCompany.cnpj).toEqual('23.871.225/0001-20');
      expect(updateCompany.website).toEqual('https://newsite.com.br');

      await service.remove({
        id: newCompany.id,
        userId: 1,
      });
    } catch (error) {
      fail(error.message);
    }
  });

  it('should not update Company with an invalid cnpj', async () => {
    try {
      const newCompany = await service.create(data[0]);
      const updateData = {
        id: newCompany.id,
        dataToUpdate: {
          cnpj: '23.871.225/0001-20222',
        },
        userId: 1,
      };

      expect(service.update(updateData)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(
        service.update({
          ...updateData,
          dataToUpdate: { cnpj: '23.871.225/0001-20222' },
        }),
      ).rejects.toThrow();

      await service.remove({
        id: newCompany.id,
        userId: 1,
      });
    } catch (error) {
      fail(error.message);
    }
  });
});
