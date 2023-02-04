import { PickType } from '@nestjs/mapped-types';
import { MachineDto } from './machine.dto';

export class CreateMachineDto extends PickType(MachineDto, [
  'serialNumber',
  'producent',
  'type',
  'modelId',
]) {}
