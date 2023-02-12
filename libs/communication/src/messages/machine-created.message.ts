import { Subjects } from './subjects';

export interface MachineCreatedMessage {
  message: Subjects.MachineCreated;
  data: {
    serialNumber: string;
    status: string;
    productionRate: number;
    version: number;
  };
}
