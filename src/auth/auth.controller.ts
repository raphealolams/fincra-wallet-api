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
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from '../users/entities/users.entity';

import { AuthService } from './auth.service';

import { SignInInput, SignUpInput, SignInResult } from './dto/index.dto';
import { LoggedInUser } from '../common/decorators/logged-in-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

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
}
