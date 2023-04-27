import { KepwareSubjects } from './subjects';

export interface RegisterWorkMessage {
  message: KepwareSubjects.RegisterWork;
  data: {
    serialNumber: string;
    work: number;
  };
}
