import { ClientProxy } from '@nestjs/microservices';
import { MachineSubjects } from '@iot/communication';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MachineUpdatedMessage } from '@iot/communication';

import { KEPWARE_QUEUE } from '../constants';

@Injectable()
export class KepwareService {
  private readonly logger = new Logger(KepwareService.name);

  constructor(
    @Inject(KEPWARE_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  emitMachineUpdated(data: MachineUpdatedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.MachineUpdated, data);

    this.logger.debug(
      `Updated Machine ${data.serialNumber} was sent to kepware server`,
    );
  }
}
