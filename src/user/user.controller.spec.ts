import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { fail } from 'assert';
import { Company } from 'src/company/entities/company.entity';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';

// API must be running
describe('UserController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

  const userData: CreateUserDto = {
    email: 'teste@gmail.com',
    name: 'Gabriel Lima',
    password: '1234567',
  };

  const companyData: CreateCompanyDto = {
    name: 'HubLocal',
    cnpj: '23.871.225/0001-19',
    website: 'https://hublocal.com.br/',
  };

  const getOptions = async (hasToCreateAnUser = true) => {
    let userId = -1;
    if (hasToCreateAnUser) {
      const { data: user } = await axiosInstance.post<User>('/users', userData);
      userId = user.id;
    }

    const { data: token } = await axiosInstance.post<{ access_token: string }>(
      '/auth/login',
      userData,
    );

    return {
      userId,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
  };

  it('should create a User', async () => {
    try {
      const { data: newUser } = await axiosInstance.post<User>(
        '/users',
        userData,
      );

      expect(newUser).toBeTruthy();
      expect(typeof newUser.id).toEqual('number');
      expect(newUser.name).toEqual('Gabriel Lima');

      const { userId: _, ...options } = await getOptions(false);
      await axiosInstance.delete<{ id: number }>(
        `/users/${newUser.id}`,
        options,
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should not create a User with an email already in use', async () => {
    try {
      const { userId, ...options } = await getOptions();

      expect(axiosInstance.post<User>('/users', userData)).rejects.toThrow();

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
    } catch {
      fail('it should not reach here');
    }
  });

  it('should add a Company to a User', async () => {
    try {
      const { userId, ...options } = await getOptions();
      const { data: company } = await axiosInstance.post<Company>(
        '/companies',
        companyData,
        options,
      );

      const { data: updatedUser } = await axiosInstance.post<User>(
        `/users/${userId}/companies`,
        { company },
        options,
      );

      expect(updatedUser.id).toEqual(userId);
      expect(updatedUser.companies).toHaveLength(1);
      expect(updatedUser.companies[0].id).toEqual(company.id);

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
