import { Timeout } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { MachineUpdatedMessage } from '@iot/communication';

import { KepwareRepository } from '../repositories/kepware.repository';
import { WorkingMachineService } from './working-machine.service';

@Injectable()
export class KepwareService {
  private readonly logger = new Logger(KepwareService.name);

  constructor(
    private readonly workingMachines: WorkingMachineService,
    private readonly kepwareRepository: KepwareRepository,
  ) {}

  async update(data: MachineUpdatedMessage['data']): Promise<void> {
    try {
      const machine = await this.kepwareRepository.update(data);

      const isMachineWorking = !!this.workingMachines.find(
        machine.serialNumber,
      );

      if (isMachineWorking) {
        if (data.productionRate || data.nextMaintenance) {
          this.workingMachines.updateSimulation(machine.serialNumber, data);
        }

        if (data.status !== 'WORKING') {
          this.workingMachines.stopSimulation(machine.serialNumber);
        }
      } else if (data.status === 'WORKING') {
        this.workingMachines.startSimulation(machine);
      }
    } catch (err) {
      this.logger.error("Couldn't update machine", err);
    }
  }

  @Timeout(10000)
  async bootstrapMachines(): Promise<void> {
    const machines = await this.kepwareRepository.findWorking();

    machines.forEach((machine) => {
      this.workingMachines.startSimulation(machine);
    });

    this.logger.log(
      `Number of machines that started working ${machines.length}`,
    );
    this.logger.log('Finished bootstrapping machines');
  }
}
