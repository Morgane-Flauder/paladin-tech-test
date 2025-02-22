import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsController } from './clients/clients.controller';
import { ClientsModule } from './clients/clients.module';
import { ClientsService } from './clients/clients.service';
import { Client } from './clients/entities/client.entity';
import { HealthReport } from './health-reports/entities/health-report.entity';
import { HealthReportsController } from './health-reports/health-reports.controller';
import { HealthReportsModule } from './health-reports/health-reports.module';
import { HealthReportsService } from './health-reports/health-reports.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Client, HealthReport],
    }),
    ClientsModule,
    HealthReportsModule,
  ],
  controllers: [AppController, ClientsController, HealthReportsController],
  providers: [AppService, ClientsService, HealthReportsService],
})
export class AppModule {}
