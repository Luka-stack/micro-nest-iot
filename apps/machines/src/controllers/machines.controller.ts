import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateMachineDto } from '../dto/incoming/create-machine.dto';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { MachinesService } from '../services/machines.service';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';

@Controller('/machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  store(@Body() request: CreateMachineDto): Promise<ResponseMachineDto> {
    return this.machinesService.store(request);
  }

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
    console.log(updateMachineDto);

    return this.machinesService.update(serialNumber, updateMachineDto);
  }

  @Delete('/:serialNumber')
  @HttpCode(204)
  destroy(@Param('serialNumber') serialNumber: string) {
    return this.machinesService.destroy(serialNumber);
  }
}
