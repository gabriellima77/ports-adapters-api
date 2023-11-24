import axios, { AxiosError } from 'axios';
import { fail } from 'assert';
import { User } from 'src/user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });
  const userData = {
    email: 'teste1@gmail.com',
    password: '123456',
    name: 'John Doe',
  };

  it('should sign in an existing User', async () => {
    try {
      const { data: user } = await axiosInstance.post<User>('/users', userData);

      const { data } = await axiosInstance.post<{ access_token: string }>(
        '/auth/login',
        {
          email: 'teste1@gmail.com',
          password: '123456',
        },
      );

      expect(data).toBeTruthy();
      expect(typeof data.access_token).toEqual('string');

      const {
        data: { id },
      } = await axiosInstance.delete<{ id: number }>(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      expect(id).toEqual(user.id);
    } catch {
      fail('it should not reach here');
    }
  });

  it('should not sign in a User with wrong password', async () => {
    try {
      const { data: user } = await axiosInstance.post<User>('/users', userData);

      expect(
        axiosInstance.post<{ access_token: string }>('/auth/login', {
          email: 'teste1@gmail.com',
          password: 'wrong password',
        }),
      ).rejects.toThrow();

      expect(
        axiosInstance.post<{ access_token: string }>('/auth/login', {
          email: 'teste1@gmail.com',
          password: 'wrong password',
        }),
      ).rejects.toBeInstanceOf(AxiosError);

      const { data } = await axiosInstance.post<{ access_token: string }>(
        '/auth/login',
        {
          email: 'teste1@gmail.com',
          password: '123456',
        },
      );

      const {
        data: { id },
      } = await axiosInstance.delete<{ id: number }>(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      expect(id).toEqual(user.id);
    } catch {
      fail('it should not reach here');
    }
  });

  it('should not delete a User without token', async () => {
    try {
      const { data: user } = await axiosInstance.post<User>('/users', userData);

      expect(
        axiosInstance.delete<{ id: number }>(`/users/${user.id}`),
      ).rejects.toThrow();

      expect(
        axiosInstance.delete<{ id: number }>(`/users/${user.id}`),
      ).rejects.toBeInstanceOf(AxiosError);

      const { data } = await axiosInstance.post<{ access_token: string }>(
        '/auth/login',
        {
          email: 'teste1@gmail.com',
          password: '123456',
        },
      );
      const {
        data: { id },
      } = await axiosInstance.delete<{ id: number }>(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    } catch {
      fail('it should not reach here');
    }
  });
});
