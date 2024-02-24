import { MachineSubjects } from './subjects';

export interface EmployeeAssignedMessage {
  message: MachineSubjects.EmployeeAssigned;
  data: {
    machineId: string;
    employee: string;
    version: number;
  };
}
