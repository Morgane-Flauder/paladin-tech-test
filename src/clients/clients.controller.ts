import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { HealthReport } from '../health-reports/entities/health-report.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import ClientNotFoundException from './exceptions/client-not-found.exception';

@Controller('client')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    const client = await this.clientsService.getById(id);

    if (!client) {
      throw new ClientNotFoundException(id);
    }

    return client;
  }

  @Get(':id/health-reports')
  async getHealthReportsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HealthReport[]> {
    return this.clientsService.getHealthReportByClientId(id);
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientsService.replace({ id, createClientDto });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update({ id, updateClientDto });
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.delete(id);
  }
}
