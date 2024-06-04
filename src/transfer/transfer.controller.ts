import {
  Body,
  Controller,
  Post,
  Version,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InitiateTransferDto } from './dtos/transfer.dto';

import { TransferService } from './transfer.service';
import { LoggedInUser } from '../common/decorators/logged-in-user.decorator';

import { UserRole } from '../common/enums/index.enum';
import { User } from '../users/entities/user.entity';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('transfer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@ApiTags('transfer')
@ApiBearerAuth()
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('')
  @Version('1')
  async initiateWalletTransfer(
    @Body() payload: InitiateTransferDto,
    @LoggedInUser() user: User,
  ): Promise<any> {
    return this.transferService.initiateWalletTransfer(payload, user);
  }
}
