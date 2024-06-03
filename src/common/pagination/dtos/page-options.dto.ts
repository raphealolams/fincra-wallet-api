import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
  IsString,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.DESC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly sort?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly startDate?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly endDate?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly query?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly currency?: any;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  readonly status?: any;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  readonly isDefault?: any;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 100;

  @ApiPropertyOptional()
  @IsOptional()
  isAdmin?: boolean = false;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
