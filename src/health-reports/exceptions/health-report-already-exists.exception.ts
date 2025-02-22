import { ForbiddenException } from '@nestjs/common';

export default class HealthReportAlreadyExistsException extends ForbiddenException {
  constructor(clientId: number, year: number) {
    super(
      `Health report for client id ${clientId} and year ${year} already exists`,
    );
  }
}
