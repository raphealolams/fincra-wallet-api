import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { isPhoneNumber } from 'class-validator';

import { Repository, DataSource } from 'typeorm';

import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';

import {
  SignUpInput,
  SignInResult,
  SignInInput,
  JwtPayload,
} from './dto/index.dto';

import {
  appendSignToPhoneNumber,
  catchErrorMessage,
  StringHelpers,
} from '../common/helpers/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
    private dataSource: DataSource,
  ) {}

  private catchErrorMessage = catchErrorMessage;

  private issueRefreshToken(payload: JwtPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: 2592000 * 6, // ~6 months
    });

    return refreshToken;
  }

  private generateToken(user): SignInResult {
    const payload: JwtPayload = {
      id: user.id,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.issueRefreshToken(payload);
    return {
      ...user.toJSON(),
      token,
      refreshToken,
    };
  }

  async validateUser({ id }: JwtPayload): Promise<User> {
    const user = await this.usersService.findOneById(id, []);
    return user;
  }

  /**
   * @author
   * @param input
   * @returns User
   */
  async signUp(input: SignUpInput): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { ...rest } = input;

      const isPhoneValid = isPhoneNumber(
        appendSignToPhoneNumber(input.phoneNumber),
      );
      if (!isPhoneValid) {
        throw new HttpException('Invalid Phone Number', HttpStatus.BAD_REQUEST);
      }

      const lowercaseEmail = StringHelpers.removeWhiteSpace(
        rest.email?.toLowerCase(),
      );
      const phoneNumber = StringHelpers.removeWhiteSpace(rest.phoneNumber);

      let user: User | null = null;

      const u = new User();

      Object.assign(u, { ...rest });

      u.phoneNumber = phoneNumber;
      u.email = lowercaseEmail;

      user = await queryRunner.manager.save(User, u);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      const { message, statusCode } = this.catchErrorMessage(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(message, statusCode);
    } finally {
      await queryRunner.release();
    }
  }

  // handles login logic.
  async signIn(input: SignInInput): Promise<SignInResult> {
    try {
      const email = StringHelpers.removeWhiteSpace(input.email?.toLowerCase());
      const user = await this.usersService.findOneWithOpts(
        {
          where: {
            email,
            isActive: true,
          },
        },
        [],
      );

      if (!user) {
        return new SignInResult();
      }

      const valid = User.comparePasswords(input.password, user.password);

      if (!valid) {
        return new SignInResult();
      }
      const payload = this.generateToken(user);
      return payload;
    } catch (error) {
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    }
  }

  async refreshAccessToken(refresh: string): Promise<any> {
    try {
      const { id } = this.jwtService.verify(refresh);
      return {
        access: this.jwtService.sign({ id }),
        refresh: this.issueRefreshToken({ id }),
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid auth token - Token expired.');
      }
      throw error;
    }
  }

  async me({ id }): Promise<User> {
    try {
      const user = await this.usersService.findOneById(id, []);
      return user;
    } catch (error) {
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    }
  }
}
