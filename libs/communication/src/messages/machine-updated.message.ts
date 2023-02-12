import { Subjects } from './subjects';

export interface MachineUpdatedMessage {
  message: Subjects.MachineUpdated;
  data: {
    serialNumber: string;
    status?: string;
    productionRate?: number;
    version: number;
  };
}
