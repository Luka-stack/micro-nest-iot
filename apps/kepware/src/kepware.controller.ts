import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
  RmqService,
  Subjects,
} from '@iot/communication';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { KepwareService } from './kepware.service';

@Controller()
export class KepwareController {
  constructor(
    private readonly kepwareService: KepwareService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(Subjects.MachineCreated)
  async store(
    @Payload() data: MachineCreatedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.store(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern(Subjects.MachineUpdated)
  async update(
    @Payload() data: MachineUpdatedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.update(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern(Subjects.MachineDeleted)
  async delete(
    @Payload() data: MachineDeletedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.delete(data);
      this.rmqService.ack(context);
    } catch {}
  }
}
