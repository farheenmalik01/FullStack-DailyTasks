import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { MyStuff } from '../users/entities/my-stuff.entity';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5433');
const DB_USERNAME = process.env.DB_USERNAME || 'farheen';
const DB_PASSWORD = process.env.DB_PASSWORD || 'farheen';
const DB_DATABASE = process.env.DB_DATABASE || 'users';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, MyStuff],
  migrations: [],
  subscribers: [],
});
