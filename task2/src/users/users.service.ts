import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MyStuff } from './entities/my-stuff.entity';
import { saveUserDataToFile } from './utils/file-handler';

export interface LocalUser {
  id: string;
  name: string;
  profilePicture: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(MyStuff)
    private myStuffRepository: Repository<MyStuff>,
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
    console.log('create method called with:', createUserDto);
    if (Array.isArray(createUserDto)) {
      throw new Error('createUserDto should not be an array');
    }
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    console.log('User created and saved in DB:', savedUser);
    try {
      console.log('Calling saveUserDataToFile in create');
      await saveUserDataToFile(savedUser);
      console.log('User data saved to JSON file after create.');
    } catch (error) {
      console.error('Error saving user data to JSON file after create:', error);
    }
    return savedUser;
  }

  async update(id: number, updateUserDto: any): Promise<User | null> {
    console.log('update method called with id:', id, 'data:', updateUserDto);
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (updatedUser) {
      console.log('User updated in DB:', updatedUser);
      try {
        console.log('Calling saveUserDataToFile in update');
        await saveUserDataToFile(updatedUser);
        console.log('User data saved to JSON file after update.');
      } catch (error) {
        console.error('Error saving user data to JSON file after update:', error);
      }
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: parseInt(id) });
  }

  async updateUser(id: string, data: any): Promise<User | null> {
    console.log('updateUser method called with id:', id, 'data:', data);
    await this.usersRepository.update(parseInt(id), data);
    const updatedUser = await this.usersRepository.findOneBy({ id: parseInt(id) });
    if (updatedUser) {
      console.log('User updated in DB (updateUser):', updatedUser);
      try {
        console.log('Calling saveUserDataToFile in updateUser');
        await saveUserDataToFile(updatedUser);
        console.log('User data saved to JSON file after updateUser.');
      } catch (error) {
        console.error('Error saving user data to JSON file after updateUser:', error);
      }
    }
    return updatedUser;
  }

  async updateProfilePicture(id: string, filename: string): Promise<User | null> {
    console.log('updateProfilePicture method called with id:', id, 'filename:', filename);
    const profilePicturePath = `/uploads/${filename}`;
    await this.usersRepository.update(parseInt(id), { profilePicture: profilePicturePath });
    const updatedUser = await this.usersRepository.findOneBy({ id: parseInt(id) });
    if (updatedUser) {
      try {
        console.log('Calling saveUserDataToFile in updateProfilePicture');
        await saveUserDataToFile(updatedUser);
        console.log(`Profile picture updated for user ID: ${id} with file: ${profilePicturePath}`);
        console.log('User data saved to JSON file after updateProfilePicture.');
      } catch (error) {
        console.error('Error saving user data to JSON file after updateProfilePicture:', error);
      }
    }
    return updatedUser;
  }

  async createMyStuff(userId: number, data: Partial<MyStuff>): Promise<MyStuff> {
    if (!data.title || !data.description) {
      throw new Error('Title and description are required');
    }
    const myStuff = this.myStuffRepository.create({
    ...data,
    userId
  });

    return await this.myStuffRepository.save(myStuff);
  }

  async findMyStuffByUser(userId: number): Promise<MyStuff[]> {
    return this.myStuffRepository.find({ where: { userId } });
  }

  async findMyStuff(): Promise<MyStuff[]> {
    return this.myStuffRepository.find();
  }

  async findMyStuffById(id: number): Promise<MyStuff | null> {
    return this.myStuffRepository.findOneBy({ id });
  }
}
