import { promises as fs } from 'fs';
import { join } from 'path';
import { User } from '../entities/user.entity';

const dataDir = '/usr/src/app/src/user-data';

export async function saveUserDataToFile(user: User): Promise<void> {
  try {
    console.log('Saving user data to file for user:', user);
    await fs.mkdir(dataDir, { recursive: true });

    const filePath = join(dataDir, `user-${user.id}.json`);
    const userData = JSON.stringify(user, null, 2);

    await fs.writeFile(filePath, userData, 'utf-8');
    console.log(`User data saved to file: ${filePath} for user ID: ${user.id}`);
  } catch (error) {
    console.error('Error saving user data to file:', error);
    throw error;
  }
}
