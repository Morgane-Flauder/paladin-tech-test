import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from '../clients/entities/client.entity';
import { HealthReport } from './entities/health-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthReport, Client])],
  exports: [TypeOrmModule],
})
export class HealthReportsModule {}
