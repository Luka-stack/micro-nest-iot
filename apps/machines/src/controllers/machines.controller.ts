import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';
import { MachinesService } from '../services/machines.service';

@Controller('/machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  create(@Body() request: CreateMachineDto) {
    return this.machinesService.createMachine(request);
  }

  @Get()
  query(@Query() queryMachineDto: QueryMachineDto) {
    return this.machinesService.query(queryMachineDto);
  }

  @Patch('/:serialNumber')
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    console.log(serialNumber, updateMachineDto);
    return this.machinesService.patch(serialNumber, updateMachineDto);
  }

  @Delete('/:serialNumber')
  destroy(@Param('serialNumber') serialNumber: string) {
    return this.machinesService.destroy(serialNumber);
  }

  // @Post()
  // changeStatus(@Body() request: { name: string; on: boolean }) {
  //   return this.devicesService.changeStatus(request);
  // }
}
