import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
})
export class UsersModule {}
