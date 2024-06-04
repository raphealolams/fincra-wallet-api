import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class InitiateTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(4)
  pin: number;

  @IsNotEmpty()
  @IsUUID()
  recipient: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  narration?: string;
}
