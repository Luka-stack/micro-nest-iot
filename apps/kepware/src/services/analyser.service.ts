import { KepwareSubjects } from '@iot/communication';
import { DataProducedMessage } from '@iot/communication/messages/data-produced.message';
import { MachineStatusChangedMessage } from '@iot/communication/messages/machine-status-changed.message';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { ANALYSER_QUEUE } from '../constants/queues';

@Injectable()
export class AnalyserService {
  constructor(
    @Inject(ANALYSER_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  emitProducedData(data: DataProducedMessage['data']): void {
    this.clientProxy.emit(KepwareSubjects.DataProduced, data);
  }

  emitStatusChange(data: MachineStatusChangedMessage['data']): void {
    this.clientProxy.emit(KepwareSubjects.MachineStatusChanged, data);
  }
}
