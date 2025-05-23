import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { AppDataSource } from '../../database/data-source';

async function migratePasswordsInDB() {
  try {
    await AppDataSource.initialize();
    console.log('Data source has been initialized.');

    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    for (const user of users) {
      if (user.password && !user.password.startsWith('$2b$')) {
        console.log(`Hashing password for user: ${user.email}`);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await userRepository.save(user);
        console.log(`Updated password hash saved for user: ${user.email}`);
      }
    }

    console.log('Password migration in database completed.');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during password migration in database:', error);
    process.exit(1);
  }
}

migratePasswordsInDB();
