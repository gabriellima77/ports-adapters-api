import 'dotenv/config';
import { UserService } from './user.service';
import { UserRepositoryAdapterInMemory } from './adapters/user-repository-adapter-in-memory';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  const jwtService = new JwtService();
  const usersData: CreateUserDto[] = [
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

  beforeEach(async () => {
    const repository = new UserRepositoryAdapterInMemory();
    service = new UserService(repository, jwtService);
  });

  it('should create a User', async () => {
    try {
      const newUser = await service.create(usersData[0]);

      expect(newUser).toBeTruthy();
      expect(newUser.name).toEqual(usersData[0].name);
      expect(newUser.email).toEqual(usersData[0].email);
      expect(typeof newUser.password).toEqual('string');
      await service.remove(newUser.id);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should not create a User with an email already in use', async () => {
    try {
      const user = await service.create(usersData[0]);

      expect(service.create(usersData[0])).rejects.toThrow();
      await service.remove(user.id);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find all Users', async () => {
    try {
      await Promise.all(usersData.map((user) => service.create(user)));

      const users = await service.findAll();
      expect(users).toHaveLength(2);
      expect(typeof users[0].name).toEqual('string');
      expect(typeof users[1].name).toEqual('string');
      await Promise.all(users.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should find a User', async () => {
    try {
      const newUsers = await Promise.all(
        usersData.map((user) => service.create(user)),
      );
      const user = await service.findOne(newUsers[0].id);

      expect(user).toBeTruthy();
      expect(user.id).toEqual(newUsers[0].id);
      await Promise.all(newUsers.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should remove a User', async () => {
    try {
      const newUsers = await Promise.all(
        usersData.map((user) => service.create(user)),
      );

      const { id } = await service.remove(newUsers[1].id);
      const users = await service.findAll();
      const removedUser = await service.findOne(newUsers[1].id);

      expect(users).toHaveLength(1);
      expect(id).toEqual(newUsers[1].id);
      expect(removedUser).toBeFalsy();
      await Promise.all(users.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should signIn a User', async () => {
    try {
      const newUsers = await Promise.all(
        usersData.map((user) => service.create(user)),
      );

      const { access_token } = await service.singIn(
        usersData[0].email,
        usersData[1].password,
      );

      const { email, sub } = jwtService.decode<PayloadDto>(access_token);

      expect(access_token).toBeTruthy();
      expect(typeof access_token).toBe('string');
      expect(sub).toEqual(newUsers[0].id);
      expect(email).toEqual(newUsers[0].email);
      await Promise.all(newUsers.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should signIn not signIn a User that does not exists', async () => {
    try {
      const users = await Promise.all(
        usersData.map((user) => service.create(user)),
      );

      expect(
        service.singIn('user-does-not-exist@teste.com', 'Does not matter'),
      ).rejects.toThrow();
      await Promise.all(users.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should signIn not signIn a User with invalid password', async () => {
    try {
      const users = await Promise.all(
        usersData.map((user) => service.create(user)),
      );

      expect(
        service.singIn(usersData[0].email, 'Invalid Password'),
      ).rejects.toThrow();
      await Promise.all(users.map(({ id }) => service.remove(id)));
    } catch (error) {
      fail(error.message);
    }
  });

  it('should update User name', async () => {
    try {
      const newUser = await service.create(usersData[0]);
      const updateUser = await service.update(newUser.id, { name: 'New name' });

      expect(updateUser.id).toEqual(newUser.id);
      expect(updateUser.name).not.toEqual(usersData[0].name);
      expect(updateUser.name).toEqual('New name');
      await service.remove(newUser.id);
    } catch (error) {
      fail(error.message);
    }
  });

  it('should update User password', async () => {
    try {
      const newUser = await service.create(usersData[0]);
      await service.update(newUser.id, {
        password: 'new password',
      });

      const { access_token } = await service.singIn(
        usersData[0].email,
        'new password',
      );

      expect(access_token).toBeTruthy();
      expect(typeof access_token).toEqual('string');
      expect(
        service.singIn(usersData[0].email, usersData[0].password),
      ).rejects.toThrow();
      await service.remove(newUser.id);
    } catch (error) {
      fail(error.message);
    }
  });
});
