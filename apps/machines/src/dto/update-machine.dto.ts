import { IsNumber, IsOptional } from 'class-validator';
import { MachineStatus } from '../app.types';
import { IsMachineStatus } from '../decorators/is-machine-status';

export class UpdateMachineDto {
  @IsOptional()
  @IsMachineStatus()
  status?: MachineStatus;

  @IsOptional()
  @IsNumber()
  productionRate?: number;
}
