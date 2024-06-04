import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { UserService } from './user.service';

import { UserRole } from '../common/enums/index.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { RolesGuard } from '../common/guards/roles.guard.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

import { PageOptionsDto, PaginationResponse } from '../common/pagination/dtos';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @Version('1')
  async findAll(
    @Query() paginateDto: PageOptionsDto,
  ): Promise<PaginationResponse> {
    const users = await this.usersService.findAll(paginateDto);
    return users;
  }
}
