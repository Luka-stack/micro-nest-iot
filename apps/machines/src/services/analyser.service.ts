import { ClientProxy } from '@nestjs/microservices';
import { MachineSubjects } from '@iot/communication';
import { EmployeeAssignedMessage } from '@iot/communication/messages/employee-assigned.message';
import { EmployeeUnassignedMessage } from '@iot/communication/messages/employee-unassigned.message';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnalyserService {
  private readonly logger = new Logger(AnalyserService.name);

  constructor(
    @Inject('ANALYSER_QUEUE') private readonly clientProxy: ClientProxy,
  ) {}

  emitEmployeeAssigned(data: EmployeeAssignedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.EmployeeAssigned, data);

    this.logger.debug(
      `Employee ${data.employee} assignment has been sent to the analyser server`,
    );
  }

  emitEmplyoeeUnassigned(data: EmployeeUnassignedMessage['data']): void {
    this.clientProxy.emit(MachineSubjects.EmployeeUnassigned, data);

    this.logger.debug(
      `Employee ${data.employee} unassignment has been sent to the analyser server`,
    );
  }
}
