import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class ReportMaintenanceDto {
  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  defects?: string[];

  @IsDateString()
  nextMaintenance: string;
}
