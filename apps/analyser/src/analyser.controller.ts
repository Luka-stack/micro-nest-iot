import {
  KepwareSubjects,
  RegisterUtilizationMessage,
  RegisterWorkMessage,
  RmqService,
} from '@iot/communication';
import { Controller, Get, Param } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { AnalyserService } from './analyser.service';

@Controller('/test')
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

  @Get('/:serialNumber')
  find(@Param('serialNumber') serialNumber: string) {
    return this.analyserService.findBySerialNumber(serialNumber);
  }
}
