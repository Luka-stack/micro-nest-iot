import { MachineSubjects } from './subjects';

export interface MachineCreatedMessage {
  message: MachineSubjects.MachineCreated;
  data: {
    serialNumber: string;
    status: string;
    productionRate: number;
    workBase: number;
    workRange: number;
    faultRate: number;
    defaultRate: number;
    version: number;
  };
}
