import { User } from '../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'role'> & {
        [key: string]: any;
      };
    }
  }
}