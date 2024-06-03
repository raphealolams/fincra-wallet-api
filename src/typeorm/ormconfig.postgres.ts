import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmNamingStrategy } from './typeorm-naming-strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [`${__dirname}/../**/*.entity.{ts,js}`],
        migrations: [`${__dirname}/../migrations/*.{ts,js}`],
        namingStrategy: new TypeOrmNamingStrategy(),
        autoLoadEntities: true,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
