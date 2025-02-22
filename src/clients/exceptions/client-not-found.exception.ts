import { NotFoundException } from '@nestjs/common';

export default class ClientNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Client ${id} does not exist`);
  }
}
