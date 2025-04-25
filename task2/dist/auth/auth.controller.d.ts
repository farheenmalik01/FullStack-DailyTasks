import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from '../users/dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginUserDto): Promise<AuthResponseDto>;
    signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    refreshToken(req: any): Promise<AuthResponseDto>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
