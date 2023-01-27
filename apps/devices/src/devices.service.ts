import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DevicesService {
  constructor(@Inject('KEPWARE') private readonly billingClient: ClientProxy) {}

  changeStatus(request: { name: string; on: boolean }) {
    this.billingClient.emit('device_status', {
      request,
    });
    return { name: request.name, on: request.on };
  }
}
