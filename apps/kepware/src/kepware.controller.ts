import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
  RmqService,
  MachineSubjects,
} from '@iot/communication';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ANALYSER_QUEUE } from './constants/queues';
import { KepwareService } from './services/kepware.service';

@Controller()
export class KepwareController {
  constructor(
    private readonly kepwareService: KepwareService,
    private readonly rmqService: RmqService,
    @Inject(ANALYSER_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  @EventPattern(MachineSubjects.MachineCreated)
  async store(
    @Payload() data: MachineCreatedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.store(data);
      this.rmqService.ack(context);
    } catch {}
  }

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

  @EventPattern(MachineSubjects.MachineDeleted)
  async delete(
    @Payload() data: MachineDeletedMessage['data'],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.kepwareService.delete(data);
      this.rmqService.ack(context);
    } catch {}
  }

  @EventPattern('analyser-test')
  test(@Payload() data, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);

    this.clientProxy.emit('data', data);
  }
}
