import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
} from '@iot/communication';
import { MachineSubjects } from '@iot/communication';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { KEPWARE_QUEUE } from '../constants/queues';

@Injectable()
export class KepwareService {
  private readonly logger = new Logger(KepwareService.name);

  constructor(
    @Inject(KEPWARE_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  emitMachineCreated(data: MachineCreatedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.MachineCreated, data);

    this.logger.debug(
      `New Machine ${data.serialNumber} was sent to kepware server`,
    );
  }

  emitMachineUpdated(data: MachineUpdatedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.MachineUpdated, data);

    this.logger.debug(
      `Updated Machine ${data.serialNumber} was sent to kepware server`,
    );
  }

  emitMachineDeleted(data: MachineDeletedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.MachineDeleted, data);

    this.logger.debug(
      `Destroyed Machine serial number ${data.serialNumber} was sent to kepware server`,
    );
  }
}
