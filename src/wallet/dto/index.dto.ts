import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '../../common/decorators/match.decorator';

export class SetWalletPinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(4)
  pin: number;

  @ApiProperty()
  @IsNumber()
  @Min(4)
  @Match('pin')
  confirmPin: number;
}
export class ChangeWalletPinDto extends SetWalletPinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currentPin: number;
}
