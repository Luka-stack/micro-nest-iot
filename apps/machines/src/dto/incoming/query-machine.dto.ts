import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsFilter } from '../../decorators/is-filter';
import { IsPriority } from '../../decorators/is-priority';
import { IsMachineStatus } from '../../decorators/is-machine-status';
import { QueryPaginationDto } from './query-pagination.dto';

export class QueryMachineDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  producents?: string;

  @IsOptional()
  types?: string;

  @IsOptional()
  models?: string;

  @IsOptional()
  @IsMachineStatus()
  status?: string;

  @IsOptional()
  @IsNumberString()
  rate?: string;

  @IsOptional()
  @IsFilter()
  rateFilter?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Provided date must looks like that 2023-02-04' },
  )
  startedAt?: string;

  @IsOptional()
  @IsFilter()
  startedAtFilter?: string;

  @IsOptional()
  @IsString()
  employee?: string;

  @IsOptional()
  @IsString()
  maintainer?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsPriority()
  nextMaintenance?: string;
}
