import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

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

  @Put('/client/:clientId/year/:year')
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

  @Delete('/client/:clientId/year/:year')
  delete(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.healthReportsService.delete({ clientId, year });
  }
}
