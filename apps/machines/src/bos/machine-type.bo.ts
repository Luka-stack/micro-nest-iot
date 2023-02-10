import { Type as TypeModel } from '@prisma/db-machines';

export class MachineTypeBo implements TypeModel {
  id: number;

  name: string;

  producentId: number;

  static from(typeModel: TypeModel): MachineTypeBo {
    const machineModelBo = new MachineTypeBo();

    machineModelBo.id = typeModel.id;
    machineModelBo.name = typeModel.name;
    machineModelBo.producentId = typeModel.producentId;

    return machineModelBo;
  }

  static fromList(typeModels: TypeModel[]): MachineTypeBo[] {
    return typeModels.map((prod) => MachineTypeBo.from(prod));
  }
}
