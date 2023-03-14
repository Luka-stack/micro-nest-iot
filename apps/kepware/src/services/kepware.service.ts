import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
} from '@iot/communication';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Machine } from '@prisma/db-kepware';

import { WorkingMachine } from '../common/working-machine';
import { KepwareRepository } from '../repositories/kepware.repository';
import { AnalyserService } from './analyser.service';

@Injectable()
export class KepwareService {
  private readonly workingMachines: Map<string, WorkingMachine> = new Map();
  private readonly logger = new Logger(KepwareService.name);

  constructor(
    private readonly kepwareRepository: KepwareRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly analyserService: AnalyserService,
  ) {}

  async store(data: MachineCreatedMessage['data']): Promise<void> {
    try {
      await this.kepwareRepository.create(data);
    } catch (err) {
      this.logger.error("Couldn't create machine");
    }
  }

  async update(data: MachineUpdatedMessage['data']): Promise<void> {
    try {
      const machine = await this.kepwareRepository.update(data);

      const workingMachine = this.workingMachines.get(machine.serialNumber);

      if (workingMachine) {
        if (data.status !== 'WORKING') {
          workingMachine.stopSimulation();
          this.workingMachines.delete(machine.serialNumber);
          return;
        }

        if (data.productionRate) {
          workingMachine.updateSimulation(data.productionRate);
        }

        return;
      }

      if (data.status === 'WORKING') {
        const workingMachine = this.createMachine(machine);
        workingMachine.startSimulation();
        this.workingMachines.set(machine.serialNumber, workingMachine);

        return;
      }
    } catch (err) {
      this.logger.error("Couldn't update machine");
    }
  }

  async delete(data: MachineDeletedMessage['data']): Promise<void> {
    const workingMachine = this.workingMachines.get(data.serialNumber);

    if (workingMachine) {
      workingMachine.stopSimulation();
      this.workingMachines.delete(data.serialNumber);
    }

    try {
      await this.kepwareRepository.delete(data.serialNumber);
    } catch (err) {
      this.logger.error("Couldn't delete machine");
    }
  }

  @Timeout(10000)
  async bootstrapMachines(): Promise<void> {
    const machines = await this.kepwareRepository.findMany();

    machines.forEach((machine) => {
      const workingMachine = this.createMachine(machine);
      workingMachine.startSimulation();
      this.workingMachines.set(machine.serialNumber, workingMachine);
    });

    this.logger.log('Finished bootstrapping machines');
  }

  private createMachine(machine: Machine): WorkingMachine {
    return new WorkingMachine(
      machine,
      this.schedulerRegistry,
      this.analyserService,
    );
  }
}
