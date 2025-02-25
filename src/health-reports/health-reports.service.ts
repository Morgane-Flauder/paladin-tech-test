import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientsService } from '../clients/clients.service';
import ClientNotFoundException from '../clients/exceptions/client-not-found.exception';
import { CreateHealthReportDto } from './dto/create-health-report.dto';
import { HealthReport } from './entities/health-report.entity';
import HealthReportAlreadyExistsException from './exceptions/health-report-already-exists.exception';
import HealthReportNotFoundException from './exceptions/health-report-not-found.exception';

@Injectable()
export class HealthReportsService {
  constructor(
    @InjectRepository(HealthReport)
    private healthReportsRepository: Repository<HealthReport>,
    @Inject(forwardRef(() => ClientsService))
    private clientsService: ClientsService,
  ) {}

  async getHealthReportsByClientId(clientId: number): Promise<HealthReport[]> {
    const client = await this.clientsService.getById(clientId, {
      relations: { healthReports: true },
    });

    if (!client) {
      throw new ClientNotFoundException(clientId);
    }

    return client.healthReports;
  }

  async getByClientIdAndYear(
    clientId: number,
    year: number,
  ): Promise<HealthReport | null> {
    return this.healthReportsRepository.findOne({
      relations: { client: true },
      where: {
        client: { id: clientId },
        year,
      },
    });
  }

  async create({
    clientId,
    year,
    createHealthReportDto,
  }: {
    clientId: number;
    year: number;
    createHealthReportDto: CreateHealthReportDto;
  }): Promise<HealthReport> {
    const client = await this.clientsService.getById(clientId);

    if (!client) {
      throw new ClientNotFoundException(clientId);
    }

    const healthReport = await this.getByClientIdAndYear(clientId, year);

    if (healthReport) {
      throw new HealthReportAlreadyExistsException(clientId, year);
    }

    const newHealthReport = new HealthReport();
    newHealthReport.year = year;
    newHealthReport.client = client;
    newHealthReport.guidance = createHealthReportDto.guidance;

    return this.healthReportsRepository.save(newHealthReport);
  }

  async replace({
    clientId,
    year,
    createHealthReportDto,
  }: {
    clientId: number;
    year: number;
    createHealthReportDto: CreateHealthReportDto;
  }): Promise<HealthReport> {
    const client = await this.clientsService.getById(clientId);

    if (!client) {
      throw new ClientNotFoundException(clientId);
    }

    const healthReport = await this.getByClientIdAndYear(clientId, year);

    if (!healthReport) {
      throw new HealthReportNotFoundException(clientId, year);
    }

    healthReport.guidance = createHealthReportDto.guidance;

    return this.healthReportsRepository.save(healthReport);
  }

  async delete({ clientId, year }: { clientId: number; year: number }) {
    const healthReport = await this.getByClientIdAndYear(clientId, year);

    if (!healthReport) {
      throw new HealthReportNotFoundException(clientId, year);
    }

    return this.healthReportsRepository.delete(healthReport);
  }
}
