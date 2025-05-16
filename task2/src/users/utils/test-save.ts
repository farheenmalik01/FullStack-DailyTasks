import { saveUserDataToFile } from './file-handler';
import { User } from '../entities/user.entity';

async function testSave() {
  const mockUser: User = {
    id: 123,
    firstName: 'Test',
    lastName: 'User',
    age: 30,
    email: 'testuser@example.com',
    password: 'password',
    tokenVersion: 0,
    token: null as any,
    role: 'user',
    profilePicture: null as any,
    myStuff: []
  };

  try {
    await saveUserDataToFile(mockUser);
    console.log('Test user data saved successfully.');
  } catch (error) {
    console.error('Error during test save:', error);
  }
}

testSave();
