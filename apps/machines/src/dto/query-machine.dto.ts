import { IsOptional } from 'class-validator';

export class QueryMachineDto {
  @IsOptional()
  producents?: string;

  @IsOptional()
  types?: string;

  @IsOptional()
  models?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  rate?: string;

  @IsOptional()
  rateFilter?: string;

  @IsOptional()
  startedAt?: string;

  @IsOptional()
  startedAtFilter?: string;
}
