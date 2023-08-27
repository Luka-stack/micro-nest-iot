import { Exclude, Expose, Transform } from 'class-transformer';

export class MachineModelDto {
  @Exclude()
  id: number;

  name: string;

  @Expose({ groups: ['machine'] })
  workBase: number;

  @Expose({ groups: ['machine'] })
  workRange: number;

  @Expose({ groups: ['machine'] })
  faultRate: number;

  @Expose({ groups: ['machine'] })
  minRate: number;

  @Expose({ groups: ['machine'] })
  maxRate: number;

  @Expose({ groups: ['machine'] })
  defaultRate: number;

  @Transform(({ value }) => value.name)
  producent: string;

  @Transform(({ value }) => value.name)
  type: string;

  @Exclude()
  typeId: number;

  @Exclude()
  producentId: number;
}
