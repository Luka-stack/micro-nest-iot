import { Exclude, plainToInstance, Transform } from 'class-transformer';

import { MachineTypeDto } from './machine-type.dto';
import { MachineModelDto } from './machine-model.dto';

export class MachineDto {
  @Exclude()
  id: number;

  serialNumber: string;

  imageUrl: string;

  producent: string;

  @Transform(({ value }) => plainToInstance(MachineTypeDto, value))
  type: MachineTypeDto;

  @Transform(({ value }) =>
    plainToInstance(MachineModelDto, value, { groups: ['machine'] }),
  )
  model: MachineModelDto;

  status: string;

  lastStatusUpdate: Date;

  productionRate: number;

  @Exclude()
  version: number;
}
