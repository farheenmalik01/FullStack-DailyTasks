import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

jest.mock('../src/auth/decorators/roles.decorator', () => ({
  Roles: () => () => {},
}));

const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  updateProfilePicture: jest.fn(),
};

const mockAuthService = {
  refreshToken: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
};

const mockUserRepository = {
  findOneBy: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadPicture', () => {
    it('should upload a valid image file and return updated user', async () => {
      const userId = '1';
      const file = { filename: 'test-image.png', mimetype: 'image/png' } as Express.Multer.File;
      const updatedUser = { id: 1, name: 'Test User', profilePicture: '/uploads/test-image.png' };

      mockUsersService.updateProfilePicture.mockResolvedValue(updatedUser);

      const result = await controller.uploadPicture(userId, file);

      expect(mockUsersService.updateProfilePicture).toHaveBeenCalledWith(userId, file.filename);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error for invalid user ID', async () => {
      const invalidUserId = 'abc';
      const file = { filename: 'test-image.png', mimetype: 'image/png' } as Express.Multer.File;

      await expect(controller.uploadPicture(invalidUserId, file)).rejects.toThrow('Invalid user ID');
    });
  });
});
