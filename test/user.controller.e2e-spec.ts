import axios from 'axios';
import { fail } from 'assert';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { UserEntity } from '../src/modules/user/entities/user.entity';

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
  const getOptions = async (hasToCreateAnUser = true) => {
    let userId = -1;
    if (hasToCreateAnUser) {
      const { data: user } = await axiosInstance.post<UserEntity>(
        '/users',
        userData,
      );
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
      const { data: newUser } = await axiosInstance.post<UserEntity>(
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
    } catch (error) {
      fail(error.message);
    }
  });

  it('should not create a User with an email already in use', async () => {
    try {
      const { userId, ...options } = await getOptions();

      expect(
        axiosInstance.post<UserEntity>('/users', userData),
      ).rejects.toThrow();

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
    } catch (error) {
      fail(error.message);
    }
  });
});
