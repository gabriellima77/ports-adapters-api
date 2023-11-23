/* eslint-disable @typescript-eslint/no-var-requires */
import { UserService } from './user.service';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
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
    const data = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };
    const newUser = await service.create(data);

    expect(newUser.name).toEqual(data.name);
    expect(newUser.email).toEqual(data.email);
    expect(newUser.password).toBeTruthy();

    service.remove(newUser.id);
  });

  it('should not create a User with an email already in use', async () => {
    const data = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };

    await service.create(data);

    await expect(service.create(data)).rejects.toThrow();
  });

  it('should find all Users', async () => {
    const data = [
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

    const users = await service.findAll();
    expect(users).toHaveLength(2);
    expect(typeof users[0].name).toEqual('string');
    expect(typeof users[1].name).toEqual('string');

    newUsers.map((user) => service.remove(user.id));
  });

  it('should find a Users', async () => {
    const data = [
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
    newUsers.map((user) => service.remove(user.id));
  });

  it('should remove a User', async () => {
    const data = [
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

    const removedUser = await service.remove(newUsers[1].id);
    expect(removedUser).toBeTruthy();
    expect(removedUser.id).toEqual(newUsers[1].id);

    newUsers.map((user) => service.remove(user.id));
  });

  it('should signIn a User', async () => {
    const data = [
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

    newUsers.map((user) => service.remove(user.id));
  });

  it('should signIn not signIn a User that does not exists', async () => {
    const data = [
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

    expect(
      service.singIn('user-does-not-exist@teste.com', 'Does not matter'),
    ).rejects.toThrow();

    newUsers.map((user) => service.remove(user.id));
  });

  it('should signIn not signIn a User with invalid password', async () => {
    const data = [
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

    expect(service.singIn(data[0].email, 'Invalid Password')).rejects.toThrow();

    newUsers.map((user) => service.remove(user.id));
  });

  it('should update User name', async () => {
    const data = {
      name: 'Gabriel Lima',
      email: 'teste@gmail.com',
      password: '123456',
    };
    const newUser = await service.create(data);
    const updateUser = await service.update(newUser.id, { name: 'New name' });

    expect(updateUser.name).not.toEqual(data.name);
    expect(updateUser.name).toEqual('New name');

    service.remove(newUser.id);
  });

  it('should update User password', async () => {
    const data = {
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

    service.remove(newUser.id);
  });
});
