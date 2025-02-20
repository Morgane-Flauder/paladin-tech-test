import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  exports: [TypeOrmModule],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
