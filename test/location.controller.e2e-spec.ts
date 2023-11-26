import axios from 'axios';
import { fail } from 'assert';
import { CreateLocationDto } from '../src/modules/location/dto/create-location.dto';
import { CreateCompanyDto } from '../src/modules/company/dto/create-company.dto';
import { UserEntity } from '../src/modules/user/entities/user.entity';
import { CompanyEntity } from '../src/modules/company/entities/company.entity';
import { LocationEntity } from '../src/modules/location/entities/location.entity';

// API must be running
describe('LocationController', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });
  const locationsData: Omit<CreateLocationDto, 'companyId'>[] = [
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
    const companyData: Omit<CreateCompanyDto, 'userId'> = {
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
    };

    const { data: user } = await axiosInstance.post<UserEntity>(
      '/users',
      createUserData,
    );
    const { data: token } = await axiosInstance.post<{ access_token: string }>(
      '/auth/login',
      createUserData,
    );
    const { data: company } = await axiosInstance.post<CompanyEntity>(
      '/companies',
      { ...companyData, userId: user.id },
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      },
    );

    return {
      userId: user.id,
      companyId: company.id,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
  };
  const cleanDb = async (
    locations: LocationEntity[],
    userId: number,
    companyId: number,
    options: { headers: { Authorization: string } },
  ) => {
    await axiosInstance.delete<LocationEntity>(`/users/${userId}`, options);
    await axiosInstance.delete<{ id: number }>(
      `/companies/${companyId}`,
      options,
    );
    await Promise.all(
      locations.map((location) =>
        axiosInstance.delete(`/locations/${location.id}`, options),
      ),
    );
  };

  it('should create a Location', async () => {
    try {
      const { userId, companyId, ...options } = await getOptions();
      const locationData = { ...locationsData[0], companyId };

      const { data } = await axiosInstance.post<LocationEntity>(
        '/locations',
        locationData,
        options,
      );

      expect(data).toBeTruthy();
      expect(typeof data.id).toEqual('number');
      expect(data.name).toEqual(locationData.name);

      await cleanDb([data], userId, companyId, options);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find all Locations', async () => {
    try {
      const { userId, companyId, ...options } = await getOptions();

      const newLocations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<LocationEntity>(
            '/locations',
            { ...location, companyId },
            options,
          );

          return data;
        }),
      );

      const { data: locations } = await axiosInstance.get<LocationEntity[]>(
        '/locations',
        options,
      );

      expect(locations).toHaveLength(2);
      expect(typeof locations[0].id).toEqual('number');
      expect(typeof locations[1].id).toEqual('number');
      expect(locations[0].name).toEqual(newLocations[0].name);
      expect(locations[1].name).toEqual(newLocations[0].name);

      await cleanDb(locations, userId, companyId, options);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find one Location', async () => {
    try {
      const { userId, companyId, ...options } = await getOptions();

      const locations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<LocationEntity>(
            '/locations',
            { ...location, companyId },
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.get<LocationEntity>(
        `/locations/${locations[1].id}`,
        options,
      );

      expect(location).toBeTruthy();
      expect(typeof location.id).toEqual('number');
      expect(location.id).toEqual(locations[1].id);

      await cleanDb(locations, userId, companyId, options);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should update one Location', async () => {
    try {
      const { userId, companyId, ...options } = await getOptions();

      const locations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<LocationEntity>(
            '/locations',
            { ...location, companyId },
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.patch<LocationEntity>(
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

      await cleanDb(locations, userId, companyId, options);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should delete one Location', async () => {
    try {
      const { userId, companyId, ...options } = await getOptions();

      const newLocations = await Promise.all(
        locationsData.map(async (location) => {
          const { data } = await axiosInstance.post<LocationEntity>(
            '/locations',
            { ...location, companyId },
            options,
          );

          return data;
        }),
      );

      const { data: location } = await axiosInstance.delete<{ id: number }>(
        `/locations/${newLocations[1].id}`,
        options,
      );

      const { data: locations } = await axiosInstance.get<LocationEntity[]>(
        '/locations',
        options,
      );

      expect(location).toBeTruthy();
      expect(locations).toHaveLength(1);
      expect(typeof location.id).toEqual('number');
      expect(location.id).toEqual(newLocations[1].id);

      await cleanDb(locations, userId, companyId, options);
    } catch (error) {
      fail(error.message);
    }
  });
});
