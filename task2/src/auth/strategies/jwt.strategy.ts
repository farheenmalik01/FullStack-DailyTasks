import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('Received JWT payload:', payload);
    
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      console.error('User not found for sub:', payload.sub);
      throw new UnauthorizedException('Invalid token - user not found');
    }

    console.log('User token from DB:', user.token);
    
    if (payload.token !== user.token) {
      console.error('Token mismatch - DB token:', user.token, 'Payload token:', payload.token);
      throw new UnauthorizedException('Invalid token - token mismatch');
    }

    console.log('Token validation successful for user:', user.id); // Debug: Success
    return user;
  }
}