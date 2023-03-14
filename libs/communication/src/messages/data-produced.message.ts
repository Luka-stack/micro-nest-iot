import { KepwareSubjects } from './subjects';

export interface DataProducedMessage {
  message: KepwareSubjects.DataProduced;
  data: {
    serialNumber: string;
    work: number;
  };
}
