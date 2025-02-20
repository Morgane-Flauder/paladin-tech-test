import { IsNotEmpty, IsString } from 'class-validator';

import { CanBeUndefined } from '../../utils/canBeUndefined';

export class UpdateClientDto {
  @IsNotEmpty()
  @IsString()
  @CanBeUndefined()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @CanBeUndefined()
  lastName?: string;
}
