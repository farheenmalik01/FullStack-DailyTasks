import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface LocalUser {
  id: string;
  name: string;
  profilePicture: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>
  ) {}

  private users: LocalUser[] = [
    { id: '1', name: 'John Doe', profilePicture: null },
  ];

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    if (Array.isArray(createUserDto)) {
      throw new Error('createUserDto should not be an array');
    }
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: any): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: parseInt(id) });
  }

  async updateUser(id: string, data: any): Promise<User | null> {
    await this.usersRepository.update(parseInt(id), data);
    return this.usersRepository.findOneBy({ id: parseInt(id) });
  }

  async updateProfilePicture(id: string, filename: string): Promise<User | null> {
    await this.usersRepository.update(parseInt(id), { profilePicture: filename });
    return this.usersRepository.findOneBy({ id: parseInt(id) });
  }
}
