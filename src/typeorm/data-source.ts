import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { TypeOrmNamingStrategy } from './typeorm-naming-strategy';
config();
const env = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: env.get<string>('DATABASE_HOST'),
  port: +env.get<string>('DATABASE_PORT'),
  username: env.get<string>('DATABASE_USERNAME'),
  password: env.get<string>('DATABASE_PASSWORD'),
  database: env.get<string>('DATABASE_NAME'),
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  namingStrategy: new TypeOrmNamingStrategy(),
  logging: env.get('DATABASE_LOGGING'),
  logger: 'advanced-console',
  ssl: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
