import { Producent, Type, Model } from '@prisma/db-machines';

export class MachineLabels {
  producents: Producent[];
  types: Type[];
  models: Model[];
}
