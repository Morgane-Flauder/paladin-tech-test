import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthReport } from '../health-reports/entities/health-report.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, HealthReport])],
  exports: [TypeOrmModule],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
