import { Machine } from '@prisma/db-kepware';
import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { WorkingMachine } from '../common/working-machine';
import { AnalyserService } from './analyser.service';
import { KepwareRepository } from '../repositories/kepware.repository';
import { MACHINE_QUEUE } from '../constants/queues';
import { ClientProxy } from '@nestjs/microservices';
import { KepwareSubjects, MachineBrokeMessage } from '@iot/communication';

@Injectable()
export class WorkingMachineService {
  private readonly workingMachines: Map<string, WorkingMachine> = new Map();

  constructor(
    private readonly kepwareRepository: KepwareRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly analyserService: AnalyserService,
    @Inject(MACHINE_QUEUE) private readonly clientProxy: ClientProxy,
  ) {}

  find(serialNumber: string): WorkingMachine | undefined {
    return this.workingMachines.get(serialNumber);
  }

  startSimulation(machine: Machine) {
    const working = this.createMachine(machine);

    const workInterval = setInterval(() => {
      const work = working.simulateMachineWork();

      this.analyserService.emitMachineWork({
        serialNumber: working.machine.serialNumber,
        work,
      });
    }, working.machine.productionRate * 1000);

    const utilizationInterval = setInterval(async () => {
      this.analyserService.emitMachineUtilization({
        serialNumber: working.machine.serialNumber,
        utilization: 60,
      });

      const breakChance =
        working.rateBreakeChance() + working.maintenanceBreakeChance();

      if (Math.random() < breakChance) {
        this.breakMachine(working);
      }
    }, 60 * 1000);

    this.schedulerRegistry.addInterval(working.workInterval, workInterval);
    this.schedulerRegistry.addInterval(
      working.utilizationInterval,
      utilizationInterval,
    );

    this.workingMachines.set(working.machine.serialNumber, working);
  }

  stopSimulation(serialNumber: string) {
    const working = this.workingMachines.get(serialNumber);
    this.workingMachines.delete(serialNumber);

    if (working) {
      if (this.schedulerRegistry.doesExist('interval', working.workInterval)) {
        this.schedulerRegistry.deleteInterval(working.workInterval);
      }

      if (
        this.schedulerRegistry.doesExist(
          'interval',
          working.utilizationInterval,
        )
      ) {
        this.schedulerRegistry.deleteInterval(working.utilizationInterval);
      }
    }
  }

  updateSimulation(
    serialNumber: string,
    data: { productionRate?: number; nextMaintenance?: string },
  ): void {
    const working = this.workingMachines.get(serialNumber);

    if (working) {
      if (this.schedulerRegistry.doesExist('interval', working.workInterval)) {
        this.schedulerRegistry.deleteInterval(working.workInterval);
      }

      working.update(data);
      this.startSimulation(working.machine);
    }
  }

  private async breakMachine(working: WorkingMachine) {
    this.stopSimulation(working.machine.serialNumber);

    await this.kepwareRepository.brakeMachine(working.machine.serialNumber);

    this.clientProxy.emit<any, MachineBrokeMessage['data']>(
      KepwareSubjects.MachineBroke,
      {
        serialNumber: working.machine.serialNumber,
      },
    );
  }

  private createMachine(machine: Machine) {
    return new WorkingMachine(machine);
  }
}
