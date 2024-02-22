import { Exclude } from 'class-transformer';

export class MachineHistoryDto {
  @Exclude()
  id: number;

  @Exclude()
  machineSerialNumber: number;

  maintainer: string;

  description: string;

  date: string;

  type: string;

  scheduled: string;

  nextMaintenance: string;
}
