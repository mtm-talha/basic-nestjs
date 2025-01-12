import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor() {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'demo_test',
      synchronize: process.env.SYNC_DATABASE
        ? process.env.SYNC_DATABASE === 'true'
        : process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
      logging: process.env.DB_LOG === 'true' || false,
    };
  }
}
