import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { MongoUsersService } from '../mongodb/mongo-users.service';
import { MongoUser } from '../mongodb/schemas/mongo-user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mongoUsersService: MongoUsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      console.log('Validating user with email:', email);
      console.log('Password received:', pass, 'Length:', pass.length);
      const user = await this.usersService.findByEmail(email);
      console.log('User found:', user ? user.email : 'No user found');
      if (user) {
        const passwordMatch = await bcrypt.compare(pass, user.password);
        console.log('Password match:', passwordMatch);
        if (passwordMatch) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('AuthService: Error validating user', error);
      throw new InternalServerErrorException('Error validating user');
    }
  }

  async login(user: User) {
  try {
    const payload = { 
      sub: user.id,
      tokenVersion: user.tokenVersion,
    };
    const token = this.jwtService.sign(payload);

    user.token = token;
    await this.usersService.update(user.id, user);
    user.tokenVersion += 1;

    console.log('Generated new token:', token);
    console.log('Stored token in DB for user:', user.id);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Signin successful',
      token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('AuthService: Error during login', error);
    throw new InternalServerErrorException('Error during login');
  }
}

  async validateMongoUser(email: string, pass: string): Promise<any> {
    try {
      const user: MongoUser | null = await this.mongoUsersService.validateUser(email, pass);
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('AuthService: Error validating MongoDB user', error);
      throw new InternalServerErrorException('Error validating MongoDB user');
    }
  }

  async loginMongoUser(user: MongoUser) {
    try {
      const payload = {
        sub: user._id,
        tokenVersion: user.tokenVersion,
      };
      const token = this.jwtService.sign(payload);

      user.tokenVersion += 1;
      await this.mongoUsersService.updateTokenVersion(user._id, user.tokenVersion);

      const userObj = user.toObject();
      delete userObj.password;

      return {
        message: 'MongoDB signin successful',
        token,
        user: userObj,
      };
    } catch (error) {
      console.error('AuthService: Error during MongoDB login', error);
      throw new InternalServerErrorException('Error during MongoDB login');
    }
  }

  async refreshToken(user: User) {
    try {
      const freshUser = await this.usersService.findOne(user.id);
      if (!freshUser) {
        console.error('AuthService: User not found during token refresh', user.id);
        throw new UnauthorizedException('User not found');
      }
      const payload = { 
        sub: user.id,
        tokenVersion: user.tokenVersion 
      };
      const token = this.jwtService.sign(payload);

      const { password, ...userWithoutPassword } = freshUser;

      return {
        message: 'Token refreshed successfully',
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('AuthService: Error during token refresh', error);
      throw new InternalServerErrorException('Error during token refresh');
    }
  }

  async logout(userId: number) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      user.tokenVersion += 1;
      await this.usersService.update(userId, user);
    } catch (error) {
      console.error('AuthService: Error during logout', error);
      throw new InternalServerErrorException('Error during logout');
    }
  }

  async signup(createUserDto: any) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('AuthService: Error during signup', error);
      throw new InternalServerErrorException('Error during signup');
    }
  }
}
