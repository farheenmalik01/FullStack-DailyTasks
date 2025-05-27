import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoUsersService } from '../src/mongodb/mongo-users.service';
import { MongoUser } from '../src/mongodb/schemas/mongo-user.schema';

describe('MongoUsersService', () => {
  let service: MongoUsersService;
  let model: Model<MongoUser>;

  const mockUser = {
    _id: 'userId123',
    email: 'test@example.com',
    password: 'password123',
    tokenVersion: 1,
  } as any;

  const mockModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoUsersService,
        {
          provide: getModelToken('MongoUser'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<MongoUsersService>(MongoUsersService);
    model = module.get<Model<MongoUser>>(getModelToken('MongoUser'));

    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail('test@example.com');
      expect(model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user found', async () => {
      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByEmail('notfound@example.com');
      expect(model.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should return user if email and password match', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'password123');
      expect(service.findByEmail).toHaveBeenCalledWith('notfound@example.com');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const userWithDifferentPassword = { ...mockUser, password: 'wrongpassword' } as any;
      jest.spyOn(service, 'findByEmail').mockResolvedValue(userWithDifferentPassword);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateTokenVersion', () => {
    it('should call updateOne with correct parameters', async () => {
      mockModel.updateOne.mockResolvedValue({});

      await service.updateTokenVersion('userId123', 2);
      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: 'userId123' },
        { tokenVersion: 2 },
      );
    });
  });
});
