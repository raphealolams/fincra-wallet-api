import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  TransactionType,
  TransactionStatus,
} from '../../common/enums/transactions.enum';
import { User } from '../../users/entities/user.entity';
export class CreateTransactionDto {
  @IsNotEmpty()
  @Type(() => Number)
  balanceBeforeTransaction: number;

  @IsNotEmpty()
  @Type(() => Number)
  balanceAfterTransaction: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  user: User;

  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
