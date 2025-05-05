import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation succeeds', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashed', id: 1 };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ email: 'test@example.com', id: 1 });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashed', id: 1 };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

    describe('login', () => {
      it('should return a signed JWT token and user data', async () => {
        const user = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          email: 'test@example.com',
          password: 'hashedpassword',
          tokenVersion: 0,
          token: 'mock-token',
          role: 'user',
        };
        jest.spyOn(service, 'login').mockImplementation(async (user) => {
          return {
            message: 'Signin successful',
            token: 'mock-token',
            user,
          };
        });

        const result = await service.login(user);
        expect(result).toEqual({
          message: 'Signin successful',
          token: 'mock-token',
          user,
        });
      });
    });
});
