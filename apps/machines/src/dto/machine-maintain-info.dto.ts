import { Exclude } from 'class-transformer';

export class MachineMaintainInfoDto {
  @Exclude()
  id: number;

  @Exclude()
  machineId: number;

  defects: string[];

  priority: number;

  maintenance: Date;
}
