import { MachineModelBo } from './machine-model.bo';
import { MachineProducentBo } from './machine-producent.bo';
import { MachineTypeBo } from './machine-type.bo';

export class MachineLabelsBo {
  machineProducents: MachineProducentBo[];

  machineTypes: MachineTypeBo[];

  machineModels: MachineModelBo[];
}
