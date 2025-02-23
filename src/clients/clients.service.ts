import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import {
  Guidance,
  HealthReport,
} from '../health-reports/entities/health-report.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import ClientNotFoundException from './exceptions/client-not-found.exception';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(HealthReport)
    private healthReportsRepository: Repository<HealthReport>,
  ) {}

  async getHomonyms(): Promise<
    {
      clientId: number;
      healthReports: {
        year: number;
        guidance: Guidance;
      }[];
    }[][]
  > {
    // Return an array of array of homonyms and their health reports, grouped by full name.
    // Each element is an array of all the clients ids with the same name and their health reports.

    const homonymsList: {
      homonyms: {
        clientId: number;
        healthReports: {
          year: number;
          guidance: Guidance;
        }[];
      }[];
    }[] = await this.clientsRepository
      .createQueryBuilder('client')
      .select(
        `JSON_ARRAYAGG(
                          JSON_OBJECT(
                            'clientId',client.id,
                            'healthReports', (
                              SELECT JSON_ARRAYAGG(
                                JSON_OBJECT('year', report.year, 'guidance', report.guidance)
                              )
                              FROM health_reports report
                              WHERE report.client_id = client.id
                            )
                          )
                        )`,
        'homonyms',
      )
      .groupBy('client.first_name')
      .addGroupBy('client.last_name')
      .having('COUNT(*) > 1')
      .getRawMany();

    return homonymsList.map((elem) => elem.homonyms);
  }

  async getById(
    id: number,
    options?: FindOneOptions<Client>,
  ): Promise<Client | null> {
    return this.clientsRepository.findOne({
      ...options,
      where: {
        id: id,
        ...options?.where,
      },
    });
  }

  async getHealthReportByClientId(id: number): Promise<HealthReport[]> {
    const client = await this.getById(id, {
      relations: { healthReports: true },
    });

    if (!client) {
      throw new ClientNotFoundException(id);
    }

    return client.healthReports;
  }

  create(createClientDto: CreateClientDto): Promise<Client> {
    const client = new Client();
    client.firstName = createClientDto.firstName;
    client.lastName = createClientDto.lastName;

    return this.clientsRepository.save(client);
  }

  async replace({
    id,
    createClientDto,
  }: {
    id: number;
    createClientDto: CreateClientDto;
  }): Promise<Client> {
    const client = await this.getById(id);

    if (!client) {
      throw new ClientNotFoundException(id);
    }

    client.firstName = createClientDto.firstName;
    client.lastName = createClientDto.lastName;

    return this.clientsRepository.save(client);
  }

  async update({
    id,
    updateClientDto,
  }: {
    id: number;
    updateClientDto: UpdateClientDto;
  }): Promise<Client> {
    const client = await this.getById(id);

    if (!client) {
      throw new ClientNotFoundException(id);
    }

    client.firstName = updateClientDto.firstName ?? client.firstName;
    client.lastName = updateClientDto.lastName ?? client.lastName;

    return this.clientsRepository.save(client);
  }

  async delete(id: number) {
    const client = await this.getById(id, {
      relations: { healthReports: true },
    });

    if (!client) {
      throw new ClientNotFoundException(id);
    }

    if (client.healthReports) {
      await this.healthReportsRepository.remove(client.healthReports);
    }

    return this.clientsRepository.delete(id);
  }
}
