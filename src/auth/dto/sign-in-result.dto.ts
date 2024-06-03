import { User } from '../../users/entities/users.entity';

export class SignInResult extends User {
  readonly token: string;

  readonly refreshToken: string;
}
