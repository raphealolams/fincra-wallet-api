import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { User } from '../../users/entities/users.entity';

import { StringHelpers } from '../../common/helpers/index';

export class SignUpInput implements Partial<User> {
  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(1)
  readonly email: string;

  @ApiProperty()
  @IsAscii()
  @IsNumberString()
  @IsNotEmpty()
  @Matches(StringHelpers.alphaNumRegExp, {
    message: 'Phone number is invalid',
  })
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
