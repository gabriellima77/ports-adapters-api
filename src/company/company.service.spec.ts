import { CompanyRepositoryAdapterInMemory } from './adapters/company-repository-adapter-in-memory';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    const repository = new CompanyRepositoryAdapterInMemory();
    service = new CompanyService(repository);
  });

  it('should create a Company', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
    };
    const company = await service.create(data);

    expect(company.name).toEqual(data.name);
    expect(company.cnpj).toEqual(data.cnpj);
    expect(company.website).toEqual(data.website);

    service.remove(company.id);
  });

  it('should find all Companies', async () => {
    const data: CreateCompanyDto[] = [
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-19',
        website: 'https://hublocal.com.br/',
      },
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-18',
        website: 'https://hublocal.com.br/',
      },
    ];

    const newCompanies = await Promise.all(
      data.map((company) => service.create(company)),
    );

    const companies = await service.findAll();

    expect(companies).toHaveLength(2);
    expect(typeof companies[0].cnpj).toEqual('string');
    expect(typeof companies[1].cnpj).toEqual('string');

    newCompanies.map((company) => service.remove(company.id));
  });

  it('should remove Company', async () => {
    const data: CreateCompanyDto[] = [
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-19',
        website: 'https://hublocal.com.br/',
      },
      {
        name: 'HubLocal',
        cnpj: '23.871.225/0001-18',
        website: 'https://hublocal.com.br/',
      },
    ];

    const newCompanies = await Promise.all(
      data.map((company) => service.create(company)),
    );

    const removedCompany = await service.remove(newCompanies[1].id);

    expect(removedCompany).toBeTruthy();
    expect(removedCompany.id).toEqual(newCompanies[1].id);

    newCompanies.map((company) => service.remove(company.id));
  });

  it('should update Company', async () => {
    const data: CreateCompanyDto = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
    };

    const newCompany = await service.create(data);
    const updateCompany = await service.update(newCompany.id, {
      name: 'New name',
      cnpj: '23.871.225/0001-20',
      website: 'https://newsite.com.br',
    });

    expect(updateCompany.name).not.toEqual(data.name);
    expect(updateCompany.cnpj).not.toEqual(data.cnpj);
    expect(updateCompany.website).not.toEqual(data.website);

    expect(updateCompany.name).toEqual('New name');
    expect(updateCompany.cnpj).toEqual('23.871.225/0001-20');
    expect(updateCompany.website).toEqual('https://newsite.com.br');

    service.remove(newCompany.id);
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [CompanyService],
  //   }).compile();

  //   service = module.get<CompanyService>(CompanyService);
  // });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});
