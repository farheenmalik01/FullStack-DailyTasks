import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'farheen',
  password: process.env.DB_PASSWORD || 'farheen',
  database: process.env.DB_DATABASE || 'users',
  entities: [User],
  synchronize: true,
  logging: false,
};
