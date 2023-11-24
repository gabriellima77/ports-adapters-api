import axios from 'axios';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { fail } from 'assert';

describe('CompanyController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

  const companiesData: CreateCompanyDto[] = [
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
    const { data: user } = await axiosInstance.post<User>(
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
      const { data: company } = await axiosInstance.post<Company>(
        '/companies',
        companiesData[0],
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
          const { data } = await axiosInstance.post<Company>(
            '/companies',
            company,
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
      const { data: company } = await axiosInstance.post<Company>(
        '/companies',
        companiesData[0],
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
});
