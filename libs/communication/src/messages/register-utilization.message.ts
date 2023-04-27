import { KepwareSubjects } from './subjects';

export interface RegisterUtilizationMessage {
  message: KepwareSubjects.RegisterUtilization;
  data: {
    serialNumber: string;
    utilization: number;
  };
}
