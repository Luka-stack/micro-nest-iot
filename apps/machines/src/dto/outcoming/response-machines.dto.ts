import { MachineDto } from '../machine.dto';
import { PaginationMetadataDto } from '../pagination-metadata.dto';

export interface ResponseMachinesDto {
  data: MachineDto[];
  meta: PaginationMetadataDto;
}
