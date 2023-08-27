import { MachineStatus } from '../app.types';
import { Model } from './model';
import { Type } from './type';

export interface Machine {
  id: number;

  serialNumber: string;

  imageUrl: string;

  producent: string;

  status: MachineStatus;

  lastStatusUpdate: Date;

  productionRate: number;

  type: Type;

  model: Model;

  version: number;
}
