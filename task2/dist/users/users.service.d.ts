import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export interface LocalUser {
    id: string;
    name: string;
    profilePicture: string | null;
}
export declare class UsersService {
    usersRepository: Repository<User>;
    constructor(usersRepository: Repository<User>);
    private users;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: Partial<User>): Promise<User>;
    update(id: number, updateUserDto: any): Promise<User | null>;
    remove(id: number): Promise<void>;
    getUser(id: string): Promise<User | null>;
    updateUser(id: string, data: any): Promise<User | null>;
    updateProfilePicture(id: string, filename: string): Promise<User | null>;
}
