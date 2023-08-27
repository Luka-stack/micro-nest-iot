import { MachineModelDto } from '../machine-model.dto';
import { MachineTypeDto } from '../machine-type.dto';
import { MachineProducentDto } from '../machine-producent.dto';

export interface ResponseFiltersDto {
  data: {
    producents: MachineProducentDto[];
    types: MachineTypeDto[];
    models: MachineModelDto[];
  };
}
