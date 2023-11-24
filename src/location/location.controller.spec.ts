import axios from 'axios';
import { User } from 'src/user/entities/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/location.entity';
import { fail } from 'assert';

// API must be running
describe('LocationController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });
  const locationsData: CreateLocationDto[] = [
    {
      name: 'Hublocal',
      cep: '60160-250',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
    },
    {
      name: 'Hublocal',
      cep: '60160-250',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
    },
  ];
  const getOptions = async () => {
    const createUserData = {
      name: 'Gabriel Lima',
      email: 'test@gmail.com',
      password: '123456',
    };
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

  it('should create a Location', async () => {
    try {
      const { userId, ...options } = await getOptions();

      const { data } = await axiosInstance.post<Location>(
        '/locations',
        locationsData[0],
        options,
      );

      expect(data).toBeTruthy();
      expect(typeof data.id).toEqual('number');
      expect(data.name).toEqual(locationsData[0].name);

      await axiosInstance.delete<{ id: number }>(`/users/${userId}`, options);
      await axiosInstance.delete<{ id: number }>(
        `/locations/${data.id}`,
        options,
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should find all Locations', async () => {
    try {
      const { userId, ...options } = await getOptions();

      const newLocations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<Location>(
            '/locations',
            location,
            options,
          );

          return data;
        }),
      );

      const { data: locations } = await axiosInstance.get<Location[]>(
        '/locations',
        options,
      );

      expect(locations).toHaveLength(2);
      expect(typeof locations[0].id).toEqual('number');
      expect(typeof locations[1].id).toEqual('number');
      expect(locations[0].name).toEqual(newLocations[0].name);
      expect(locations[1].name).toEqual(newLocations[0].name);

      await axiosInstance.delete<Location>(`/users/${userId}`, options);
      await Promise.all(
        locations.map((location) =>
          axiosInstance.delete(`/locations/${location.id}`, options),
        ),
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should find one Location', async () => {
    try {
      const { userId, ...options } = await getOptions();

      const locations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<Location>(
            '/locations',
            location,
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.get<Location>(
        `/locations/${locations[1].id}`,
        options,
      );

      expect(location).toBeTruthy();
      expect(typeof location.id).toEqual('number');
      expect(location.id).toEqual(locations[1].id);

      await axiosInstance.delete<Location>(`/users/${userId}`, options);
      await Promise.all(
        locations.map((location) =>
          axiosInstance.delete(`/locations/${location.id}`, options),
        ),
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should update one Location', async () => {
    try {
      const { userId, ...options } = await getOptions();

      const locations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<Location>(
            '/locations',
            location,
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.patch<Location>(
        `/locations/${locations[1].id}`,
        {
          name: 'New name',
          houseNumber: '42069',
        },
        options,
      );

      expect(location).toBeTruthy();
      expect(typeof location.id).toEqual('number');
      expect(location.id).toEqual(locations[1].id);

      expect(location.name).not.toEqual(locations[1].name);
      expect(location.houseNumber).not.toEqual(locations[1].houseNumber);

      expect(location.name).toEqual('New name');
      expect(location.houseNumber).toEqual('42069');

      await axiosInstance.delete<Location>(`/users/${userId}`, options);
      await Promise.all(
        locations.map((location) =>
          axiosInstance.delete(`/locations/${location.id}`, options),
        ),
      );
    } catch {
      fail('it should not reach here');
    }
  });

  it('should delete one Location', async () => {
    try {
      const { userId, ...options } = await getOptions();

      const newLocations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<Location>(
            '/locations',
            location,
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.delete<{ id: number }>(
        `/locations/${newLocations[1].id}`,
        options,
      );

      const { data: locations } = await axiosInstance.get<Location[]>(
        '/locations',
        options,
      );

      expect(location).toBeTruthy();
      expect(locations).toHaveLength(1);
      expect(typeof location.id).toEqual('number');
      expect(location.id).toEqual(newLocations[1].id);

      await axiosInstance.delete<Location>(`/users/${userId}`, options);
      await Promise.all(
        locations.map((location) =>
          axiosInstance.delete(`/locations/${location.id}`, options),
        ),
      );
    } catch (error) {
      console.log('error =>>', error);
      fail('it should not reach here');
    }
  });
});
