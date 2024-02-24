import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  KepwareSubjects,
  MachineBrokeMessage,
  RmqService,
} from '@iot/communication';
import { Controller } from '@nestjs/common';
import { MachinesService } from '../services/machines.service';

@Controller()
export class QueueController {
  constructor(
    private readonly machinesService: MachinesService,
    private readonly rmqService: RmqService,
  ) {}

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
