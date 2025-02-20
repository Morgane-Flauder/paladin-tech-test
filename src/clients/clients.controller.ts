import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientsService.getById(id);
  }
}
