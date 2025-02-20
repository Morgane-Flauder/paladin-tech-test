import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientsService.getById(id);
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }
}
