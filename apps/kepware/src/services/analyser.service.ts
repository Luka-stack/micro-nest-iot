import {
  KepwareSubjects,
  RegisterUtilizationMessage,
  RegisterWorkMessage,
} from '@iot/communication';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { ANALYSER_QUEUE } from '../constants/queues';

@Injectable()
export class AnalyserService {
  constructor(
    @Inject(ANALYSER_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  emitMachineWork(data: RegisterWorkMessage['data']): void {
    this.clientProxy.emit(KepwareSubjects.RegisterWork, data);
  }

  emitMachineUtilization(data: RegisterUtilizationMessage['data']): void {
    this.clientProxy.emit(KepwareSubjects.RegisterUtilization, data);
  }
}
