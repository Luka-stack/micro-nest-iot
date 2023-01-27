import { RmqService } from '@iot/communication';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { KepwareService } from './kepware.service';

@Controller()
export class KepwareController {
  constructor(
    private readonly kepwareService: KepwareService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('device_status')
  handleDeviceStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.kepwareService.handle(data);
    this.rmqService.ack(context);
  }
}
