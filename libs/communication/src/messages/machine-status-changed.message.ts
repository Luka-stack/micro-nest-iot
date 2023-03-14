import { KepwareSubjects } from './subjects';

export interface MachineStatusChangedMessage {
  message: KepwareSubjects.MachineStatusChanged;
  data: {
    serialNumber: string;
    status: string;
  };
}
