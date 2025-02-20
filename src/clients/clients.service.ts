import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async getById(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (client) {
      return client;
    }

    throw new NotFoundException(`Client ${id} does not exist`);
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
    const client = await this.clientsRepository.findOneBy({ id });

    if (client) {
      client.firstName = createClientDto.firstName;
      client.lastName = createClientDto.lastName;

      return this.clientsRepository.save(client);
    }

    throw new NotFoundException(`Client ${id} does not exist`);
  }

  async update({
    id,
    updateClientDto,
  }: {
    id: number;
    updateClientDto: UpdateClientDto;
  }): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (client) {
      client.firstName = updateClientDto.firstName ?? client.firstName;
      client.lastName = updateClientDto.lastName ?? client.lastName;

      return this.clientsRepository.save(client);
    }

    throw new NotFoundException(`Client ${id} does not exist`);
  }
}
