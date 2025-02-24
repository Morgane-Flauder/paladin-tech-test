import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateHealthReportDto } from './dto/create-health-report.dto';
import { HealthReport } from './entities/health-report.entity';
import { HealthReportsService } from './health-reports.service';

@Controller('/clients/:clientId/health-reports')
export class HealthReportsController {
  constructor(private healthReportsService: HealthReportsService) {}

  @Get()
  async getHealthReportsByClientId(
    @Param('clientId', ParseIntPipe) id: number,
  ): Promise<HealthReport[]> {
    return this.healthReportsService.getHealthReportsByClientId(id);
  }

  @Post(':year')
  create(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('year', ParseIntPipe) year: number,
    @Body() createHealthReportDto: CreateHealthReportDto,
  ): Promise<HealthReport | null> {
    return this.healthReportsService.create({
      clientId,
      year,
      createHealthReportDto,
    });
  }

  @Put(':year')
  replace(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('year', ParseIntPipe) year: number,
    @Body() createHealthReportDto: CreateHealthReportDto,
  ): Promise<HealthReport> {
    return this.healthReportsService.replace({
      clientId,
      year,
      createHealthReportDto,
    });
  }

  @Delete(':year')
  @HttpCode(204)
  delete(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.healthReportsService.delete({ clientId, year });
  }
}
