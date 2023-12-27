import { KepwareSubjects } from './subjects';

export interface MachineBrokeMessage {
  message: KepwareSubjects.MachineBroke;
  data: {
    serialNumber: string;
    version: number;
  };
}
