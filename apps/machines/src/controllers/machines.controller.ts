import {
  CurrentUser,
  JwtAuthGuard,
  Roles,
  USER_ROLES,
  UserPayload,
} from '@iot/security';

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
import { ReportMaintenanceDto } from '../dto/incoming/report-maintenance.dto';

@Controller('/machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get('/:serialNumber')
  findOne(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.findOne(serialNumber, user);
  }

  @Get()
  async findMany(
    @Query() queryMachineDto: QueryMachineDto,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseMachinesDto> {
    return this.machinesService.findMany(queryMachineDto, user);
  }

  @Get('/:serialNumber/with-history')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE)
  async findMachineWithHistory(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.findMachineWithHistory(serialNumber, user);
  }

  @Get('/:serialNumber/history')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MAINTAINER)
  async findMachineHistory(@Param('serialNumber') serialNumber: string) {
    return this.machinesService.findMachineHistory(serialNumber);
  }

  @Patch('/:serialNumber')
  update(
    @Param('serialNumber') serialNumber: string,
    @Body() updateMachineDto: UpdateMachineDto,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseMachineDto> {
    return this.machinesService.update(serialNumber, updateMachineDto, user);
  }

  @Post('/:serialNumber/assign-employee')
  @Roles(USER_ROLES.ADMIN)
  assignEmployee(
    @Param('serialNumber') serialNumber: string,
    @Body() employee: AssignEmployeeDto,
  ) {
    return this.machinesService.assignEmployee(serialNumber, employee);
  }

  @Post('/:serialNumber/add-defect')
  @Roles(USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN)
  addtDefect(
    @Param('serialNumber') serialNumber: string,
    @Body('defect') defect: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.addDefect(serialNumber, defect, user);
  }

  @Post('/:serialNumber/delete-defect')
  @Roles(USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN)
  @HttpCode(204)
  deleteDefect(
    @Param('serialNumber') serialNumber: string,
    @Body('defect') defect: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.deleteDefect(serialNumber, defect, user);
  }

  @Post('/:serialNumber/report-maintenance')
  @Roles(USER_ROLES.MAINTAINER)
  @HttpCode(204)
  reportMaintenance(
    @Param('serialNumber') serialNumber: string,
    @Body() payload: ReportMaintenanceDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.reportMaintenance(serialNumber, user, payload);
  }

  @Post('/:serialNumber/priority')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE)
  changePriority(
    @Param('serialNumber') serialNumber: string,
    @Body('priority') priority: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.changePriority(serialNumber, priority, user);
  }

  @Post('/:serialNumber/assign-maintainer')
  @Roles(USER_ROLES.MAINTAINER)
  @HttpCode(204)
  assignMaintainer(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.assignMaintainer(serialNumber, user);
  }

  @Post('/:serialNumber/unassign-maintainer')
  @Roles(USER_ROLES.MAINTAINER)
  @HttpCode(204)
  unassignMaintainer(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.machinesService.unassignMaintainer(serialNumber, user);
  }
}
