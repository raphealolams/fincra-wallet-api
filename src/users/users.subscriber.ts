import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo(): any {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      event.entity.password = bcrypt.hashSync(event.entity.password, salt);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      event.entity.password = bcrypt.hashSync(event.entity.password, salt);
    }
  }
}
