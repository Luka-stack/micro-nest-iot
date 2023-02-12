import { Subjects } from './subjects';

export interface MachineDeletedMessage {
  message: Subjects.MachineDeleted;
  data: {
    serialNumber: string;
  };
}
