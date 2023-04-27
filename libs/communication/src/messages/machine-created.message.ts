import { MachineSubjects } from './subjects';

export interface MachineCreatedMessage {
  message: MachineSubjects.MachineCreated;
  data: {
    serialNumber: string;
    status: string;
    workBase: number;
    workRange: number;
    faultRate: number;
    minRate: number;
    maxRate: number;
    defaultRate: number;
    productionRate: number;
    version: number;
  };
}
