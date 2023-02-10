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
import { MachineBo } from '../bos/machine.bo';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';
import { MachinesService } from '../services/machines.service';

@Controller('/machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  store(@Body() request: CreateMachineDto) {
    return this.machinesService.store(request);
  }

  @Get('/:serialNumber')
  findOne(@Param('serialNumber') serialNumber: string): Promise<MachineBo> {
    return this.machinesService.findOne(serialNumber);
  }

  @Get()
  findMany(@Query() queryMachineDto: QueryMachineDto) {
    return this.machinesService.findMany(queryMachineDto);
  }

  @Patch('/:serialNumber')
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ): Promise<MachineBo> {
    return this.machinesService.update(serialNumber, updateMachineDto);
  }

  @Delete('/:serialNumber')
  @HttpCode(204)
  destroy(@Param('serialNumber') serialNumber: string): Promise<void> {
    return this.machinesService.destroy(serialNumber);
  }
}
