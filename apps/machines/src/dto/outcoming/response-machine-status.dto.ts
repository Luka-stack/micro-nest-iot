import { MachineStatus } from '../../app.types';

export interface ResponseMachineStatusDto {
  data: {
    status: MachineStatus;
  };
}
