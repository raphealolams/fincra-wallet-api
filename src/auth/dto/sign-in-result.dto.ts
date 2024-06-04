import { User } from '../../users/entities/user.entity';

export class SignInResult extends User {
  readonly token: string;

  readonly refreshToken: string;
}
