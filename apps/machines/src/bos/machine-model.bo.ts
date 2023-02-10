import { Model } from '@prisma/db-machines';

export class MachineModelBo implements Model {
  id: number;

  name: string;

  typeId: number;

  static from(model: Model): MachineModelBo {
    const machineModelBo = new MachineModelBo();

    machineModelBo.id = model.id;
    machineModelBo.name = model.name;
    machineModelBo.typeId = model.typeId;

    return machineModelBo;
  }

  static fromList(models: Model[]): MachineModelBo[] {
    return models.map((prod) => MachineModelBo.from(prod));
  }
}
