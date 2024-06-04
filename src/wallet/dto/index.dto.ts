import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '../../common/decorators/match.decorator';

export class ChangeWalletPinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currentPin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;

  @ApiProperty()
  @IsString()
  @Match('pin')
  confirmPin: string;
}

export class SetWalletPinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;

  @ApiProperty()
  @IsString()
  @Match('pin')
  confirmPin: string;
}
