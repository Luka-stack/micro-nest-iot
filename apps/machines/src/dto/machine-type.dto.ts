import {
  Type as MachineType,
  Producent as MachineProducent,
} from '@prisma/db-machines';
import { Exclude, Transform } from 'class-transformer';

export class MachineTypeDto implements MachineType {
  @Exclude()
  id: number;

  name: string;

  imageUrl: string;

  @Transform(({ value }) => {
    return value.map((p: MachineProducent) => p.name);
  })
  producents: string[];
}
