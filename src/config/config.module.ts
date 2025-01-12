import { Module } from '@nestjs/common';
import { PostgresConfigService } from './db.service';

@Module({
  providers: [PostgresConfigService],
})
export class PostgresConfigModule {}
