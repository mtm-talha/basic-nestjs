import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  remove: jest.fn(),
});

const mockMessageQueue = {
  emit: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Users>;
  let messageQueue: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository(),
        },
        {
          provide: 'MESSAGE_QUEUE',
          useValue: mockMessageQueue,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    messageQueue = module.get<ClientProxy>('MESSAGE_QUEUE');
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        age: 25,
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findByEmail('test@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should throw a ConflictException if email already exists', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        age: 25,
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

      await expect(
        service.createUser({
          email: 'test@example.com',
          name: 'Test',
          age: 25,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save a new user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        age: 25,
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.createUser({
        email: 'test@example.com',
        name: 'Test',
        age: 25,
      });
      expect(result).toEqual(mockUser);
      expect(messageQueue.emit).toHaveBeenCalledWith('user_created', {
        email: 'test@example.com',
        name: 'Test',
      });
    });
  });

  describe('findUsers', () => {
    it('should return a paginated list of users', async () => {
      const mockUsers = [
        { id: 1, name: 'Test', email: 'test@example.com', age: 25 },
      ];
      jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([mockUsers, 1]);

      const result = await service.findUsers({ page: 1, limit: 10 });
      expect(result).toEqual({ data: mockUsers, total: 1 });
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        age: 25,
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundException if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.updateUser(1, { name: 'Updated', age: 30 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update and save the user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        age: 25,
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ ...mockUser, name: 'Updated', age: 30 });

      const result = await service.updateUser(1, { name: 'Updated', age: 30 });
      expect(result).toEqual({
        id: 1,
        name: 'Updated',
        email: 'test@example.com',
        age: 30,
      });
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete the user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        age: 25,
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(mockUser);

      const result = await service.deleteUser(1);
      expect(result).toEqual({
        message: 'User with ID 1 deleted successfully',
      });
    });
  });
});
