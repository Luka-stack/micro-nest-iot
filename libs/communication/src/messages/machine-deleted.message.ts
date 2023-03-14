import { MachineSubjects } from './subjects';

export interface MachineDeletedMessage {
  message: MachineSubjects.MachineDeleted;
  data: {
    serialNumber: string;
  };
}
