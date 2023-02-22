import { MachineModelDto } from '../machine-model.dto';
import { MachineProducentDto } from '../machine-producent.dto';
import { MachineTypeDto } from '../machine-type.dto';

export interface ResponseFiltersDto {
  data: {
    producents: MachineProducentDto[];
    types: MachineTypeDto[];
    models: MachineModelDto[];
  };
}
