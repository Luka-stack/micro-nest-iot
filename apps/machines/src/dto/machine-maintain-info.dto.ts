import { Exclude, Transform } from 'class-transformer';

export class MachineMaintainInfoDto {
  @Exclude()
  id: number;

  @Exclude()
  machineId: number;

  @Transform(({ value }) => {
    if (value) {
      return value;
    }

    return [];
  })
  defects: string[];

  priority: number;

  maintenance: Date;
}
