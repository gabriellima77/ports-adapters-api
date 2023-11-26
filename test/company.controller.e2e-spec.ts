import axios from 'axios';
import { fail } from 'assert';
import { CreateCompanyDto } from '../src/modules/company/dto/create-company.dto';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { UserEntity } from '../src/modules/user/entities/user.entity';
import { CompanyEntity } from '../src/modules/company/entities/company.entity';

// API must be running
describe('CompanyController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

  const companiesData: Omit<CreateCompanyDto, 'userId'>[] = [
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
      const companyData = { ...companiesData[0] };
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
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find all Companies', async () => {
    try {
      const { userId, ...options } = await getOptions();
      await Promise.all(
        companiesData.map(async (company) => {
          const { data } = await axiosInstance.post<CompanyEntity>(
            '/companies',
            { ...company },
            options,
          );
          return data;
        }),
      );
      const { data: companies } = await axiosInstance.get<CompanyEntity[]>(
        `/companies`,
        options,
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
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find all User Companies', async () => {
    try {
      const { userId, ...option } = await getOptions();
      const { data: user } = await axiosInstance.post<UserEntity>('/users', {
        name: 'Test2',
        email: 'test2@gmail.com',
        password: '123456',
      });
      const {
        data: { access_token },
      } = await axiosInstance.post<{ access_token: string }>('/auth/login', {
        email: user.email,
        password: '123456',
      });
      const options = [
        option,
        { headers: { Authorization: `Bearer ${access_token}` } },
      ];
      const users = [userId, user.id];

      await Promise.all(
        companiesData.map(async (company, index) => {
          const { data } = await axiosInstance.post<CompanyEntity>(
            '/companies',
            { ...company },
            options[index],
          );
          return data;
        }),
      );
      const { data: companies } = await axiosInstance.get<CompanyEntity[]>(
        `/companies`,
        option,
      );

      expect(companies).toHaveLength(1);
      expect(typeof companies[0].id).toEqual('number');

      Promise.all(
        users.map(
          async (userId, index) =>
            await axiosInstance.delete<{ id: number }>(
              `/users/${userId}`,
              options[index],
            ),
        ),
      );
      await Promise.all(
        companies.map((company, index) =>
          axiosInstance.delete<{ id: number }>(
            `/companies/${company.id}`,
            options[index],
          ),
        ),
      );
    } catch (error) {
      fail(error.message);
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
    } catch (error) {
      fail(error.message);
    }
  });

  it('should update a Company', async () => {
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
    } catch (error) {
      fail(error.message);
    }
  });

  it('should remove a Company', async () => {
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
    } catch (error) {
      fail(error.message);
    }
  });
});
