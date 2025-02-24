import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { ClientsService } from '../clients/clients.service';
import { getDuplicates } from '../utils/duplicates/duplicates-utils';

const main = async () => {
  // Script which display an array of array of client ids considered duplicates: all the
  // health reports with the same year have also the same guidance.
  // The elements of the array are arrays of clients ids which are duplicates of the same
  // person. For example: [ [1,2], [3,4,5] ] means that clients 1 and 2 are duplicates of person A,
  // and clients 3, 4 and 5 are duplicates of person B.

  const app = await NestFactory.create(AppModule);
  const clientsService = app.get(ClientsService);

  const homonymsList = await clientsService.getHomonyms();

  const duplicatesClientsIds = homonymsList
    .map((homonyms) => getDuplicates(homonyms))
    .filter((duplicates) => duplicates.length > 0)
    .flat();

  await app.close();

  console.log(duplicatesClientsIds);
};

void main();
