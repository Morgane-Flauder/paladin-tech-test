import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CreateHealthReportDto } from './dto/create-health-report.dto';
import { HealthReport } from './entities/health-report.entity';
import { HealthReportsService } from './health-reports.service';

@Controller('health-report')
export class HealthReportsController {
  constructor(private healthReportsService: HealthReportsService) {}

  @Post('/client/:clientId/year/:year')
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
}
