import { MachineSubjects } from './subjects';

export interface EmployeeUnassignedMessage {
  message: MachineSubjects.EmployeeUnassigned;
  data: {
    machineId: string;
    version: number;
  };
}
