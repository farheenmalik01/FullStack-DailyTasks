import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: User): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            age: number;
            email: string;
            tokenVersion: number;
            token: string;
            role: string;
        };
    }>;
    refreshToken(user: User): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            age: number;
            email: string;
            tokenVersion: number;
            token: string;
            role: string;
        };
    }>;
    logout(userId: number): Promise<void>;
    signup(createUserDto: any): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        email: string;
        tokenVersion: number;
        token: string;
        role: string;
    }>;
}
