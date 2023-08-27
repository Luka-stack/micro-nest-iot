import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { MachinesService } from '../services/machines.service';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';

@Controller('/machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get('/:serialNumber')
  findOne(
    @Param('serialNumber') serialNumber: string,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.findOne(serialNumber);
  }

  @Get('/:serialNumber/status')
  findMachineStatus(
    @Param('serialNumber') serialNumber: string,
  ): Promise<ResponseMachineStatusDto> {
    return this.machinesService.findMachineStatus(serialNumber);
  }

  @Get()
  async findMany(
    @Query() queryMachineDto: QueryMachineDto,
  ): Promise<ResponseMachinesDto> {
    return this.machinesService.findMany(queryMachineDto);
  }

  @Patch('/:serialNumber')
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.update(serialNumber, updateMachineDto);
  }
}
