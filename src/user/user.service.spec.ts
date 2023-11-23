/* eslint-disable @typescript-eslint/no-var-requires */
import { UserService } from './user.service';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
const dotenv = require('dotenv');
dotenv.config({
  path: '.env',
});

describe('UserService', () => {
  let service: UserService;
  const jwtService = new JwtService();

  beforeEach(async () => {
    const repository = new UserRepositoryAdapterInMemory();
    service = new UserService(repository, jwtService);
  });

  it('should create a User', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };
    const newUser = await service.create(data);

    expect(newUser).toBeTruthy();
    expect(newUser.name).toEqual(data.name);
    expect(newUser.email).toEqual(data.email);
    expect(typeof newUser.password).toEqual('string');
  });

  it('should not create a User with an email already in use', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };

    await service.create(data);

    await expect(service.create(data)).rejects.toThrow();
  });

  it('should find all Users', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    await Promise.all(data.map((user) => service.create(user)));

    const users = await service.findAll();
    expect(users).toHaveLength(2);
    expect(typeof users[0].name).toEqual('string');
    expect(typeof users[1].name).toEqual('string');
  });

  it('should find a User', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    const newUsers = await Promise.all(
      data.map((user) => service.create(user)),
    );
    const user = await service.findOne(newUsers[0].id);

    expect(user).toBeTruthy();
    expect(user.id).toEqual(newUsers[0].id);
  });

  it('should remove a User', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    const newUsers = await Promise.all(
      data.map((user) => service.create(user)),
    );

    const { id } = await service.remove(newUsers[1].id);
    const users = await service.findAll();
    const removedUser = await service.findOne(newUsers[1].id);

    expect(users).toHaveLength(1);
    expect(id).toEqual(newUsers[1].id);
    expect(removedUser).toBeFalsy();
  });

  it('should signIn a User', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    const newUsers = await Promise.all(
      data.map((user) => service.create(user)),
    );

    const { access_token } = await service.singIn(
      data[0].email,
      data[1].password,
    );

    const { email, sub } = jwtService.decode<PayloadDto>(access_token);

    expect(access_token).toBeTruthy();
    expect(typeof access_token).toBe('string');
    expect(sub).toEqual(newUsers[0].id);
    expect(email).toEqual(newUsers[0].email);
  });

  it('should signIn not signIn a User that does not exists', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    await Promise.all(data.map((user) => service.create(user)));

    expect(
      service.singIn('user-does-not-exist@teste.com', 'Does not matter'),
    ).rejects.toThrow();
  });

  it('should signIn not signIn a User with invalid password', async () => {
    const data: CreateUserDto[] = [
      {
        name: 'Gabriel Lima',
        email: 'teste@gmail.com',
        password: '123456',
      },
      {
        name: 'Tonico',
        email: 'desenvolvedor02@hublocal.com.br',
        password: '123456',
      },
    ];

    await Promise.all(data.map((user) => service.create(user)));

    expect(service.singIn(data[0].email, 'Invalid Password')).rejects.toThrow();
  });

  it('should update User name', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };
    const newUser = await service.create(data);
    const updateUser = await service.update(newUser.id, { name: 'New name' });

    expect(updateUser.id).toEqual(newUser.id);
    expect(updateUser.name).not.toEqual(data.name);
    expect(updateUser.name).toEqual('New name');
  });

  it('should update User password', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };
    const newUser = await service.create(data);
    await service.update(newUser.id, {
      password: 'PasswordTest123',
    });

    const { access_token } = await service.singIn(
      data.email,
      'PasswordTest123',
    );

    expect(access_token).toBeTruthy();
    expect(typeof access_token).toEqual('string');
    expect(service.singIn(data.email, data.password)).rejects.toThrow();
  });

  it('should add Company to an existing User', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };

    const company = new Company({
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      id: 1,
    });

    const newUser = await service.create(data);
    await service.addCompanyToUser(newUser.id, company);

    expect(newUser.companies).toHaveLength(1);
    expect(newUser.companies[0].cnpj).toEqual('23.871.225/0001-19');
  });

  it('should not add the same Company to a User', async () => {
    const data: CreateUserDto = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };

    const company1 = new Company({
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      id: 1,
    });

    const company2 = new Company({
      name: 'HubLocal',
      cnpj: '23.871.225/0001-19',
      website: 'https://hublocal.com.br/',
      id: 1,
    });

    const newUser = await service.create(data);
    const updateUser = await service.addCompanyToUser(newUser.id, company1);
    const updateUser2 = await service.addCompanyToUser(newUser.id, company2);

    expect(updateUser2).toBeFalsy();
    expect(updateUser.companies).toHaveLength(1);
    expect(updateUser.companies[0].id).toEqual(1);
  });
});
