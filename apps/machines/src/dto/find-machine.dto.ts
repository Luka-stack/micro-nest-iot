import { PickType } from '@nestjs/mapped-types';
import { MachineDto } from './machine.dto';

export class FindMachineDto extends PickType(MachineDto, ['serialNumber']) {}
