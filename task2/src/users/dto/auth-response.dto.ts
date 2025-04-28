import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  message: string;
  token: string;
  user: Omit<User, 'password'>;
}