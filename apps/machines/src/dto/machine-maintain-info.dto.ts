import { Transform } from 'class-transformer';

export class MachineMaintainInfoDto {
  @Transform(({ value }) => (value ? value.split(',') : []))
  notes: string[];

  priority: number;

  maintenance: Date;
}
