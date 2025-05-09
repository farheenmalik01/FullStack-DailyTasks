import { UsersService, LocalUser } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User | null>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User | null>;
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
    getProfile(req: any): LocalUser | undefined;
    updateProfile(req: any, body: UpdateUserDto): LocalUser | undefined;
    uploadPicture(req: any, file: Express.Multer.File): LocalUser | undefined;
}
