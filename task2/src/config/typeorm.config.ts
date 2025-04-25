import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'farheen',
  password: 'farheen',
  database: 'users',
  entities: [User],
  synchronize: true,
  logging: false,
};