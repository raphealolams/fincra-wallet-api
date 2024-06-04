import {
  Controller,
  Get,
  Query,
  Version,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoggedInUser } from '../common/decorators/logged-in-user.decorator';
import { TransactionService } from './transaction.service';
import { PageOptionsDto, PaginationResponse } from '../common/pagination/dtos/';
import { UserRole } from '../common/enums/index.enum';
import { User } from '../users/entities/user.entity';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@ApiTags('transfer')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('')
  @Version('1')
  async getAllTransactions(
    @Query() query: PageOptionsDto,
    @LoggedInUser() user: User,
  ): Promise<PaginationResponse> {
    return this.transactionService.transactionHistories(query, user);
  }

  @Get('/:id')
  @Version('1')
  async getOneTransactions(
    @Param('id') id: string,
    @LoggedInUser() user: User,
  ): Promise<Transaction> {
    return this.transactionService.transactionHistory(id, user);
  }
}
