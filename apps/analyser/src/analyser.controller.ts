import {
  CurrentUser,
  JwtAuthGuard,
  Roles,
  USER_ROLES,
  UserPayload,
} from '@iot/security';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  EmployeeAssignedMessage,
  EmployeeUnassignedMessage,
  KepwareSubjects,
  MachineSubjects,
  RegisterUtilizationMessage,
  RegisterWorkMessage,
  RmqService,
} from '@iot/communication';

import { AnalyserService } from './analyser.service';
import { QueryUtilizationDto } from './dto/query-utilization.dto';

@Controller('/analyser')
export class AnalyserController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly analyserService: AnalyserService,
  ) {}

  @EventPattern(KepwareSubjects.RegisterWork)
  async registerWork(
    @Payload() data: RegisterWorkMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.analyserService.registerWork(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern(KepwareSubjects.RegisterUtilization)
  async registerUtilization(
    @Payload() data: RegisterUtilizationMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.analyserService.registerUtilization(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern(MachineSubjects.EmployeeAssigned)
  async addAccess(
    @Payload() data: EmployeeAssignedMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.analyserService.addAccess(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern(MachineSubjects.EmployeeUnassigned)
  async removeAccess(
    @Payload() data: EmployeeUnassignedMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.analyserService.removeAccess(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @Get('/:serialNumber/utilization')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN)
  getUtilization(
    @Param('serialNumber') serialNumber: string,
    @Query() queryUtilization: QueryUtilizationDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analyserService.getUtilization(
      serialNumber,
      queryUtilization,
      user,
    );
  }

  @Get('/:serialNumber/statistics')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN)
  getStatistics(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analyserService.getStatistics(serialNumber, user);
  }

  @Get('/:serialNumber/work')
  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN)
  getWork(
    @Param('serialNumber') serialNumber: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analyserService.getWork(serialNumber, user);
  }
}
