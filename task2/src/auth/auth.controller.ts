import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorators/public.decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthResponseDto } from '../users/dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Successful login', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 409, description: 'Conflict - user already exists' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Request() req): Promise<AuthResponseDto> {
    try {
      return await this.authService.refreshToken(req.user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 500, description: 'Logout failed' })
  async logout(@Request() req): Promise<{ message: string }> {
    try {
      await this.authService.logout(req.user.id);
      return { message: 'Logout successful' };
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }
}
