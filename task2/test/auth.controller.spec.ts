import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/auth/auth.service';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
  validateUser: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
};

const mockUserRepository = {
  findOneBy: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return auth response on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: 'test@example.com' };
      const authResponse = { token: 'token', user };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(loginDto);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(authResponse);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should return user data on successful signup', async () => {
      const createUserDto = { email: 'newuser@example.com', password: 'password', firstName: 'John', lastName: 'Doe', age: 30 };
      const createdUser = { id: 1, email: 'newuser@example.com', firstName: 'John', lastName: 'Doe', age: 30 };

      mockAuthService.signup.mockResolvedValue(createdUser);

      const result = await controller.signup(createUserDto);
      expect(mockAuthService.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('refreshToken', () => {
    it('should return new auth token on successful refresh', async () => {
      const req = { user: { id: 1 } };
      const authResponse = { token: 'newtoken', user: { id: 1 } };

      mockAuthService.refreshToken.mockResolvedValue(authResponse);

      const result = await controller.refreshToken(req);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(authResponse);
    });

    it('should throw UnauthorizedException if refreshToken throws UnauthorizedException', async () => {
      const req = { user: { id: 1 } };
      mockAuthService.refreshToken.mockRejectedValue(new UnauthorizedException());

      await expect(controller.refreshToken(req)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(req.user);
    });

    it('should throw UnauthorizedException with message if refreshToken throws other error', async () => {
      const req = { user: { id: 1 } };
      mockAuthService.refreshToken.mockRejectedValue(new Error('Some error'));

      await expect(controller.refreshToken(req)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(req.user);
    });
  });

  describe('logout', () => {
    it('should return success message on successful logout', async () => {
      const req = { user: { id: 1 } };
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(req);
      expect(mockAuthService.logout).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual({ message: 'Logout successful' });
    });

    it('should throw InternalServerErrorException if logout fails', async () => {
      const req = { user: { id: 1 } };
      mockAuthService.logout.mockRejectedValue(new Error('Logout failed'));

      await expect(controller.logout(req)).rejects.toThrow(InternalServerErrorException);
      expect(mockAuthService.logout).toHaveBeenCalledWith(req.user.id);
    });
  });
});
