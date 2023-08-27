import { Exclude } from 'class-transformer';

export class MachineProducentDto {
  @Exclude()
  id: number;

  name: string;
}
