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
  HttpCode,
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
import { ReportMaintenanceDto } from '../dto/incoming/report-maintenance.dto';

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

  @Get('/:serialNumber/history')
  @UseGuards(JwtAuthGuard)
  async findMachineHistory(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.findMachineHistory(serialNumber, user);
  }

  @Patch('/:serialNumber')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.update(serialNumber, updateMachineDto, user);
  }

  @Post('/:serialNumber/assign-employee')
  assignEmployee(
    @Param('serialNumber') serialNumber: string,
    @Body() employee: AssignEmployeeDto,
  ) {
    return this.machinesService.assignEmployee(serialNumber, employee);
  }

  @Post('/:serialNumber/add-defect')
  addtDefect(
    @Param('serialNumber') serialNumber: string,
    @Body('defect') defect: string,
  ) {
    return this.machinesService.addDefect(serialNumber, defect);
  }

  @Post('/:serialNumber/delete-defect')
  @HttpCode(204)
  deleteDefect(
    @Param('serialNumber') serialNumber: string,
    @Body('defect') defect: string,
  ) {
    return this.machinesService.deleteDefect(serialNumber, defect);
  }

  @Post('/:serialNumber/report-maintenance')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.MAINTAINER)
  reportMaintenance(
    @Param('serialNumber') serialNumber: string,
    @Body() payload: ReportMaintenanceDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.reportMaintenance(serialNumber, user, payload);
  }

  @Post('/:serialNumber/priority')
  changePriority(
    @Param('serialNumber') serialNumber: string,
    @Body('priority') priority: string,
  ) {
    return this.machinesService.changePriority(serialNumber, priority);
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

  @Post('/:serialNumber/unassign-maintainer')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.MAINTAINER)
  unassignMaintainer(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.unassignMaintainer(serialNumber, user);
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
