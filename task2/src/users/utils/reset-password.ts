import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { MyStuff } from '../entities/my-stuff.entity';
import * as bcrypt from 'bcryptjs';

async function resetPassword() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),

    username: process.env.DB_USERNAME || 'farheen',
    password: process.env.DB_PASSWORD || 'farheen',
    database: process.env.DB_DATABASE || 'users',
    entities: [User, MyStuff],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const email = 'a.47@gmail.com';
  const newPassword = 'shayan_47';

  const user = await userRepository.findOneBy({ email });
  if (!user) {
    console.error(`User with email ${email} not found`);
    process.exit(1);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await userRepository.save(user);

  console.log(`Password for user ${email} has been reset.`);

  await dataSource.destroy();
}

resetPassword().catch((error) => {
  console.error('Error resetting password:', error);
  process.exit(1);
});
