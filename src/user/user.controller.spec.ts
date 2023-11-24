import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { fail } from 'assert';

// API must be running
describe('UserController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

  it('should create a User', async () => {
    try {
      const userData: CreateUserDto = {
        email: 'teste@gmail.com',
        name: 'Gabriel Lima',
        password: '1234567',
      };
      const { data: newUser } = await axiosInstance.post<User>(
        '/users',
        userData,
      );

      expect(newUser).toBeTruthy();
      expect(typeof newUser.id).toEqual('number');
      expect(newUser.name).toEqual('Gabriel Lima');

      const { data } = await axiosInstance.post<{ access_token: string }>(
        '/auth/login',
        {
          email: userData.email,
          password: userData.password,
        },
      );
      await axiosInstance.delete<{ id: number }>(`/users/${newUser.id}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    } catch {
      fail('it should not reach here');
    }
  });

  it('should not create a User with an email already in use', async () => {
    try {
      const userData: CreateUserDto = {
        email: 'teste@gmail.com',
        name: 'Gabriel Lima',
        password: '1234567',
      };
      const { data: newUser } = await axiosInstance.post<User>(
        '/users',
        userData,
      );

      expect(axiosInstance.post<User>('/users', userData)).rejects.toThrow();

      const { data } = await axiosInstance.post<{ access_token: string }>(
        '/auth/login',
        {
          email: userData.email,
          password: userData.password,
        },
      );
      await axiosInstance.delete<{ id: number }>(`/users/${newUser.id}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    } catch {
      fail('it should not reach here');
    }
  });
});
