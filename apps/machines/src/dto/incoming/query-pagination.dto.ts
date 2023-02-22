import { IsNumberString, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  offset?: string;
}
