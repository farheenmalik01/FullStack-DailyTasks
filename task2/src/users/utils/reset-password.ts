import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function resetPassword() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'your_db_username',
    password: 'your_db_password',
    database: 'your_db_name',
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const email = 'freen@gmail.com';
  const newPassword = 'freen_01';

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
