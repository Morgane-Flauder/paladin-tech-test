import { NotFoundException } from '@nestjs/common';

export default class HealthReportNotFoundException extends NotFoundException {
  constructor(clientId: number, year: number) {
    super(
      `Health report for client id ${clientId} and year ${year} does not exist`,
    );
  }
}
