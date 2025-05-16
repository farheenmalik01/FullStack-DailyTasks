import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { User } from './entities/user.entity';
import { Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: string): Promise<void>;
    resetTokenVersion(id: string): Promise<{
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
            profilePicture: string | null;
        };
    }>;
    getProfile(req: any): Promise<User | null>;
    updateProfile(req: any, body: UpdateUserDto): Promise<User | null>;
    uploadPicture(id: string, file: Express.Multer.File): Promise<User | null>;
    getPicture(id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
