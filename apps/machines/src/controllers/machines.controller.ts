import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  CurrentUser,
  JwtAuthGuard,
  Roles,
  USER_ROLES,
  UserPayload,
} from '@iot/security';
import {
  KepwareSubjects,
  MachineBrokeMessage,
  RmqService,
} from '@iot/communication';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MachinesService } from '../services/machines.service';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { AssignEmployeeDto } from '../dto/incoming/assign-employee.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';

@Controller('/machines')
export class MachinesController {
  constructor(
    private readonly machinesService: MachinesService,
    private readonly rmqService: RmqService,
  ) {}

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
  @UseGuards(JwtAuthGuard)
  async findMany(
    @Query() queryMachineDto: QueryMachineDto,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseMachinesDto> {
    return this.machinesService.findMany(queryMachineDto, user);
  }

  @Patch('/:serialNumber')
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.update(serialNumber, updateMachineDto);
  }

  @Post('/:serialNumber/assign-employee')
  assignEmployee(
    @Param('serialNumber') serialNumber: string,
    @Body() employee: AssignEmployeeDto,
  ) {
    return this.machinesService.assignEmployee(serialNumber, employee);
  }

  @Post('/:serialNumber/assign-maintainer')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.MAINTAINER)
  assignMaintainer(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.assignMaintainer(serialNumber, user);
  }

  @EventPattern(KepwareSubjects.MachineBroke)
  async brokeMachine(
    @Payload() data: MachineBrokeMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.machinesService.brokeMachine(data);
      this.rmqService.ack(context);
    } catch {}
  }
}
