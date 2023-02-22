import { Exclude } from 'class-transformer';
import { Machine as MachineModel, Status } from '@prisma/db-machines';

export class MachineDto implements MachineModel {
  @Exclude()
  id: number;

  serialNumber: string;

  imageUrl: string;

  producent: string;

  type: string;

  model: string;

  status: Status;

  startedAt: Date;

  productionRate: number;

  @Exclude()
  version: number;
}
