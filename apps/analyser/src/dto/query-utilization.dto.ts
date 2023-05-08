import { IsDateString } from 'class-validator';

export class QueryUtilizationDto {
  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}
