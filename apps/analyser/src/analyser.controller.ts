import { KepwareSubjects, RmqService } from '@iot/communication';
import { DataProducedMessage } from '@iot/communication/messages/data-produced.message';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { AnalyserService } from './analyser.service';

@Controller('/test')
export class AnalyserController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly analyserService: AnalyserService,
  ) {}

  @EventPattern(KepwareSubjects.DataProduced)
  async dataProduced(
    @Payload() data: DataProducedMessage['data'],
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.analyserService.storeProducedData(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @Get('/:serialNumber')
  find(@Param('serialNumber') serialNumber: string) {
    return this.analyserService.findBySerialNumber(serialNumber);
  }

  @Post('/')
  create(@Body() body: { serialNumber: string; work: number }) {
    this.analyserService.storeProducedData(body);
  }
}
