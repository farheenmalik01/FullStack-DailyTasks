import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
