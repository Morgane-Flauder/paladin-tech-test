import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import ClientNotFoundException from '../clients/exceptions/client-not-found.exception';
import { HealthReport } from './entities/health-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthReport, Client]),
    ClientNotFoundException,
  ],
  exports: [TypeOrmModule],
  providers: [ClientsService],
})
export class HealthReportsModule {}
