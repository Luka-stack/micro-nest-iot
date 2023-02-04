import { IsOptional } from 'class-validator';

export class MachineDto {
  @IsOptional()
  serialNumber: string;

  @IsOptional()
  producent: string;

  @IsOptional()
  type: string;

  @IsOptional()
  modelId: number;

  @IsOptional()
  status: string;

  startedAt: Date;

  @IsOptional()
  productionRate: number;

  version: number;
}
