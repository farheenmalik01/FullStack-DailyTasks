import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    usersRepository: Repository<User>;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: Partial<User>): Promise<User>;
    update(id: number, updateUserDto: any): Promise<User | null>;
    remove(id: number): Promise<void>;
}
