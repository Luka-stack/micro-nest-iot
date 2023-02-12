import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
} from '@iot/communication';
import { Subjects } from '@iot/communication';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { KEPWARE_QUEUE } from '../constants/queues';

@Injectable()
export class KepwareService {
  constructor(
    @Inject(KEPWARE_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  emitMachineCreated(data: MachineCreatedMessage['data']): void {
    this.clientProxy.emit(Subjects.MachineCreated, data);
  }

  emitMachineUpdated(data: MachineUpdatedMessage['data']): void {
    this.clientProxy.emit(Subjects.MachineUpdated, data);
  }

  emitMachineDeleted(data: MachineDeletedMessage['data']): void {
    this.clientProxy.emit(Subjects.MachineDeleted, data);
  }
}
