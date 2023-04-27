import { Exclude, plainToInstance, Transform } from 'class-transformer';
import { Machine as MachineModel, Status } from '@prisma/db-machines';
import { MachineTypeDto } from './machine-type.dto';
import { MachineModelDto } from './machine-model.dto';

export class MachineDto implements MachineModel {
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

  status: Status;

  lastStatusUpdate: Date;

  productionRate: number;

  @Exclude()
  typeId: number;

  @Exclude()
  modelId: number;

  @Exclude()
  version: number;
}
