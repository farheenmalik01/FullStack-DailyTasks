import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create user without hashing password', async () => {
      const createUserDto = { email: 'test@example.com', password: 'plainpassword' };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result.password).toBe('plainpassword');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should hash password if present before updating user', async () => {
      const updateUserDto = { password: 'newpassword' };
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      const userId = 1;

      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOneBy.mockResolvedValue({ id: userId, password: hashedPassword });

      const result = await service.update(userId, updateUserDto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        password: expect.any(String),
      });
      expect(result).not.toBeNull();
      expect(bcrypt.compareSync('newpassword', result!.password)).toBe(true);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });
});
