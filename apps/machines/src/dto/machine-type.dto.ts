import { Exclude, Transform } from 'class-transformer';

export class MachineTypeDto {
  @Exclude()
  id: number;

  name: string;

  imageUrl: string;

  @Transform(({ value }) => {
    return value.map((p) => p.name);
  })
  producents: string[];
}
