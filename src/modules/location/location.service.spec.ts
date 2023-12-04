import { BadRequestException } from '@nestjs/common';
import { LocationRepositoryAdapterInMemory } from './adapters/location-repository-adapter-in-memory';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    const repository = new LocationRepositoryAdapterInMemory();
    service = new LocationService(repository);
  });

  it('should create a Location', async () => {
    const data: CreateLocationDto = {
      name: 'Hublocal',
      cep: '60160-250',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
      companyId: 1,
    };

    const location = await service.create(data);

    expect(location).toBeTruthy();
    expect(typeof location.id).toEqual('number');
  });

  it('should not create a Location with an invalid cep', async () => {
    const data: CreateLocationDto = {
      name: 'Hublocal',
      cep: 'INVALID CEP',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
      companyId: 1,
    };

    expect(service.create(data)).rejects.toThrow();
    expect(service.create(data)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should find all Locations', async () => {
    const data: CreateLocationDto[] = [
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
    ];

    await Promise.all(data.map((location) => service.create(location)));

    const locations = await service.findAll(1);

    expect(locations).toHaveLength(2);
    expect(typeof locations[0].id).toEqual('number');
  });

  it('should find a Location', async () => {
    const data: CreateLocationDto[] = [
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
    ];

    const newLocations = await Promise.all(
      data.map((location) => service.create(location)),
    );

    const location = await service.findOne(newLocations[0].id);

    expect(location).toBeTruthy();
    expect(location.id).toEqual(newLocations[0].id);
  });

  it('should remove a Location', async () => {
    const data: CreateLocationDto[] = [
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
      {
        name: 'Hublocal',
        cep: '60160-250',
        city: 'Fortaleza',
        houseNumber: '578',
        neighborhood: 'Meireles',
        state: 'CE',
        street: 'R. Pereira Valente',
        companyId: 1,
      },
    ];

    const newLocations = await Promise.all(
      data.map((location) => service.create(location)),
    );

    const { id } = await service.remove(newLocations[0].id);
    const locations = await service.findAll(1);
    const removeLocation = await service.findOne(newLocations[0].id);

    expect(locations).toHaveLength(1);
    expect(id).toEqual(newLocations[0].id);
    expect(removeLocation).toBeFalsy();
  });

  it('should update a Location', async () => {
    const data: CreateLocationDto = {
      name: 'Hublocal',
      cep: '60160-250',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
      companyId: 1,
    };

    const newLocation = await service.create(data);

    const updatedLocation = await service.update(newLocation.id, {
      name: 'Edited name',
      cep: '60000-000',
      city: 'Rolândia',
      houseNumber: '42069',
      neighborhood: 'No where',
      state: 'AC',
      street: 'R. dos Bobos',
    });

    expect(updatedLocation.id).toEqual(newLocation.id);
    expect(updatedLocation.name).not.toEqual(newLocation.name);
    expect(updatedLocation.cep).not.toEqual(newLocation.cep);
    expect(updatedLocation.city).not.toEqual(newLocation.city);
    expect(updatedLocation.houseNumber).not.toEqual(newLocation.houseNumber);
    expect(updatedLocation.neighborhood).not.toEqual(newLocation.neighborhood);
    expect(updatedLocation.state).not.toEqual(newLocation.state);
    expect(updatedLocation.street).not.toEqual(newLocation.street);

    expect(updatedLocation.name).toEqual('Edited name');
    expect(updatedLocation.cep).toEqual('60000-000');
    expect(updatedLocation.city).toEqual('Rolândia');
    expect(updatedLocation.houseNumber).toEqual('42069');
    expect(updatedLocation.neighborhood).toEqual('No where');
    expect(updatedLocation.state).toEqual('AC');
    expect(updatedLocation.street).toEqual('R. dos Bobos');
  });

  it('should not update a Location with an invalid cep', async () => {
    const data: CreateLocationDto = {
      name: 'Hublocal',
      cep: '60160-250',
      city: 'Fortaleza',
      houseNumber: '578',
      neighborhood: 'Meireles',
      state: 'CE',
      street: 'R. Pereira Valente',
      companyId: 1,
    };

    const newLocation = await service.create(data);

    expect(
      service.update(newLocation.id, { cep: '60000-0000' }),
    ).rejects.toThrow();
    expect(
      service.update(newLocation.id, { cep: '60000-0000' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
