import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { Guidance, guidanceOptions } from '../entities/health-report.entity';

export class CreateHealthReportDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(guidanceOptions)
  guidance: Guidance;
}
