import {
  KepwareSubjects,
  RegisterUtilizationMessage,
  RegisterWorkMessage,
  RmqService,
} from '@iot/communication';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

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

  @Get('/:serialNumber/utilization')
  getUtilization(
    @Param('serialNumber') serialNumber: string,
    @Query() queryUtilization: QueryUtilizationDto,
  ) {
    return this.analyserService.getUtilization(serialNumber, queryUtilization);
  }

  @Get('/:serialNumber/statistics')
  getStatistics(@Param('serialNumber') serialNumber: string) {
    return this.analyserService.getStatistics(serialNumber);
  }

  @Get('/:serialNumber/work')
  getWork(@Param('serialNumber') serialNumber: string) {
    return this.analyserService.getWork(serialNumber);
  }
}
