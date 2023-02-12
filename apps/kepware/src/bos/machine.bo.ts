import { Machine as MachineModel } from '@prisma/db-kepware';

export class MachineBo {
  id: number;
  serialNumber: string;
  status: string;
  productionRate: number;
  version: number;

  static from(machine: MachineModel): MachineBo {
    const machineBo = new MachineBo();

    machineBo.id = machine.id;
    machineBo.serialNumber = machine.serialNumber;
    machineBo.productionRate = machine.productionRate;
    machineBo.version = machine.version;

    return machineBo;
  }

  static fromList(machineList: MachineModel[]): MachineBo[] {
    return machineList.map((machine) => MachineBo.from(machine));
  }
}
