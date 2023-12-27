import { MachineSubjects } from './subjects';

export interface MachineUpdatedMessage {
  message: MachineSubjects.MachineUpdated;
  data: {
    serialNumber: string;
    status?: string;
    productionRate?: number;
    nextMaintenance?: string;
    version: number;
  };
}
