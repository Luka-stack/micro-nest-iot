import { Exclude, plainToInstance, Transform } from 'class-transformer';

import { MachineTypeDto } from './machine-type.dto';
import { MachineModelDto } from './machine-model.dto';
import { MachineMaintainInfoDto } from './machine-maintain-info.dto';

export class MachineDto {
  @Exclude()
  id: number;

  status: string;

  serialNumber: string;

  productionRate: number;

  lastStatusUpdate: Date;

  assignedEmployee: string;

  assignedMaintainer: string;

  producent: string;

  @Transform(({ value }) => plainToInstance(MachineTypeDto, value))
  type: MachineTypeDto;

  @Transform(({ value }) =>
    plainToInstance(MachineModelDto, value, { groups: ['machine'] }),
  )
  model: MachineModelDto;

  @Transform(({ value }) => plainToInstance(MachineMaintainInfoDto, value))
  maintainInfo: MachineMaintainInfoDto;

  @Exclude()
  version: number;
}
