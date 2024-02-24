import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  MachineUpdatedMessage,
  RmqService,
  MachineSubjects,
} from '@iot/communication';

import { KepwareService } from './services/kepware.service';

@Controller()
export class KepwareController {
  constructor(
    private readonly kepwareService: KepwareService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(MachineSubjects.MachineUpdated)
  async update(
    @Payload() data: MachineUpdatedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.update(data);
      this.rmqService.ack(context);
    } catch {}
  }
}
