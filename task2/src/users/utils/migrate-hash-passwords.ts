import { promises as fs } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcryptjs';

const dataDir = join(__dirname, '../../user-data');

async function migratePasswords() {
  try {
    const files = await fs.readdir(dataDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = join(dataDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const user = JSON.parse(content);

        if (user.password && !user.password.startsWith('$2b$')) {
          console.log(`Hashing password for user file: ${file}`);
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
          await fs.writeFile(filePath, JSON.stringify(user, null, 2), 'utf-8');
          console.log(`Updated password hash saved for user file: ${file}`);
        }
      }
    }
    console.log('Password migration completed.');
  } catch (error) {
    console.error('Error during password migration:', error);
  }
}

migratePasswords();
