import axios from 'axios';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { fail } from 'assert';

// API must be running
describe('CompanyController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

  const companiesData: CreateCompanyDto[] = [
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
  const createUserData: CreateUserDto = {
    name: 'Gabriel Lima',
    email: 'test@gmail.com',
    password: '123456',
  };
  const getOptions = async () => {
    const { data: user } = await axiosInstance.post<UserEntity>(
      '/users',
      createUserData,
    );
    const { data: token } = await axiosInstance.post<{ access_token: string }>(
      '/auth/login',
      createUserData,
    );

    return {
      userId: user.id,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
  };

  it('should create a Company', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const companyData = { ...companiesData[0], userId };
      const { data: company } = await axiosInstance.post<CompanyEntity>(
        '/companies',
        companyData,
        options,
      );

      expect(company).toBeTruthy();
      expect(typeof company.id).toEqual('number');
      expect(company.cnpj).toEqual(companiesData[0].cnpj);

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
      await axiosInstance.delete<{ id: number }>(
        `/companies/${company.id}`,
        options,
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should find all Companies', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const companies = await Promise.all(
        companiesData.map(async (company) => {
          const { data } = await axiosInstance.post<CompanyEntity>(
            '/companies',
            { ...company, userId },
            options,
          );
          return data;
        }),
      );

      expect(companies).toHaveLength(2);
      expect(typeof companies[0].id).toEqual('number');
      expect(typeof companies[1].id).toEqual('number');

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
      await Promise.all(
        companies.map((company) =>
          axiosInstance.delete<{ id: number }>(
            `/companies/${company.id}`,
            options,
          ),
        ),
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should find one Company', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const companyData = { ...companiesData[0], userId };
      const { data: newCompany } = await axiosInstance.post<CompanyEntity>(
        '/companies',
        companyData,
        options,
      );

      const { data: company } = await axiosInstance.get<CompanyEntity>(
        `/companies/${newCompany.id}`,
        options,
      );

      expect(company).toBeTruthy();
      expect(company.id).toEqual(newCompany.id);
      expect(company.name).toEqual(newCompany.name);

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
      await axiosInstance.delete<{ id: number }>(
        `/companies/${company.id}`,
        options,
      );
    } catch {
      fail('it should not reach here');
    }
  });

  xit('should update a Company', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const companyData = { ...companiesData[0], userId };
      const { data: newCompany } = await axiosInstance.post<CompanyEntity>(
        '/companies',
        companyData,
        options,
      );

      const { data: company } = await axiosInstance.patch<CompanyEntity>(
        `/companies/${newCompany.id}`,
        { name: 'New name' },
        options,
      );

      expect(company).toBeTruthy();
      expect(company.id).toEqual(newCompany.id);
      expect(company.name).toEqual('New name');

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
      await axiosInstance.delete<{ id: number }>(
        `/companies/${company.id}`,
        options,
      );
    } catch {
      fail('it should not reach here');
    }
  });

  xit('should update a Company', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const companyData = { ...companiesData[0], userId };
      const { data: newCompany } = await axiosInstance.post<CompanyEntity>(
        '/companies',
        companyData,
        options,
      );

      const {
        data: { id },
      } = await axiosInstance.delete<{ id: string }>(
        `/companies/${newCompany.id}`,
        options,
      );

      const { data: company } = await axiosInstance.get<CompanyEntity>(
        `/companies/${newCompany.id}`,
        options,
      );

      expect(id).toEqual(newCompany.id);
      expect(company).toBeFalsy();

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
    } catch {
      fail('it should not reach here');
    }
  });
});
