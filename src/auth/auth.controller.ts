import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';

import { AuthService } from './auth.service';

import { SignInInput, SignUpInput, SignInResult } from './dto/index.dto';
import { LoggedInUser } from '../common/decorators/logged-in-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard.guard';
import { UserRole } from '../common/enums/index.enum';

import { SetWalletPinDto, ChangeWalletPinDto } from '../wallet/dto/index.dto';
@Controller('auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @Version('1')
  async signUp(@Body() input: SignUpInput): Promise<User> {
    return this.authService.signUp(input);
  }

  @Post('signin')
  @HttpCode(200)
  @Version('1')
  async signIn(@Body() input: SignInInput): Promise<SignInResult> {
    const result = await this.authService.signIn(input);

    if (!result.token) {
      throw new HttpException(
        'Invalid Username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }

  @Get('me')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@LoggedInUser() user: User): Promise<User> {
    return await this.authService.me(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Patch('set-pin')
  @Version('1')
  async setPin(
    @Body() input: SetWalletPinDto,
    @LoggedInUser() user: User,
  ): Promise<any> {
    const users = await this.authService.setPin(input, user);
    return users;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Patch('change-pin')
  @Version('1')
  async changePin(
    @Body() input: ChangeWalletPinDto,
    @LoggedInUser() user: User,
  ): Promise<any> {
    const users = await this.authService.changePin(input, user);
    return users;
  }
}
