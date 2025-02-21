import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { HealthReport } from '../health-reports/entities/health-report.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async getById(id: number, options?: FindOneOptions<Client>): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      ...options,
      where: {
        id: id,
        ...options?.where,
      },
    });

    if (client) {
      return client;
    }

    throw new NotFoundException(`Client ${id} does not exist`);
  }

  async getHealthReportByClientId(id: number): Promise<HealthReport[]> {
    const client = await this.getById(id, {
      relations: { healthReports: true },
    });

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

    client.firstName = updateClientDto.firstName ?? client.firstName;
    client.lastName = updateClientDto.lastName ?? client.lastName;

    return this.clientsRepository.save(client);
  }
}
