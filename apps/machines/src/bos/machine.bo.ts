import { Machine as MachineModel, Status } from '@prisma/db-machines';
import { Exclude } from 'class-transformer';

export class MachineBo implements MachineModel {
  @Exclude()
  id: number;

  serialNumber: string;

  producent: string;

  type: string;

  modelId: number;

  status: Status;

  startedAt: Date;

  productionRate: number;

  @Exclude()
  version: number;

  static from(machine: MachineModel): MachineBo {
    const machineBo = new MachineBo();

    machineBo.id = machine.id;
    machineBo.serialNumber = machine.serialNumber;
    machineBo.producent = machine.producent;
    machineBo.type = machine.type;
    machineBo.modelId = machine.modelId;
    machineBo.status = machine.status;
    machineBo.productionRate = machine.productionRate;
    machineBo.startedAt = machine.startedAt;
    machineBo.version = machine.version;

    return machineBo;
  }

  static fromList(machines: MachineModel[]): MachineBo[] {
    return machines.map((model) => MachineBo.from(model));
  }
}
