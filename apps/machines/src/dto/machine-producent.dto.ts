import { Producent as MachineProducent } from '@prisma/db-machines';
import { Exclude } from 'class-transformer';

export class MachineProducentDto implements MachineProducent {
  @Exclude()
  id: number;

  name: string;
}
