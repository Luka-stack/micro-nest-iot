import { PickType, PartialType } from '@nestjs/mapped-types';
import { MachineDto } from './machine.dto';

export class UpdateMachineDto extends PartialType(
  PickType(MachineDto, ['status', 'productionRate']),
) {}
