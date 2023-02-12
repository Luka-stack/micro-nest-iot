import {
  MachineCreatedMessage,
  MachineDeletedMessage,
  MachineUpdatedMessage,
} from '@iot/communication';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { randomInt } from 'crypto';

import { KepwareRepository } from './repositories/kepware.repository';

@Injectable()
export class KepwareService {
  private readonly logger = new Logger(KepwareService.name);

  constructor(
    private readonly kepwareRepository: KepwareRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
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
      await this.kepwareRepository.update(data);

      if (data.status === 'WORKING' || data.productionRate) {
        this.startSymulation(data.serialNumber, data.productionRate);
        return;
      }

      if (data.status === 'IDLE' || data.status === 'MAINTENANCE') {
        this.schedulerRegistry.deleteInterval(data.serialNumber);
      }
    } catch (err) {
      this.logger.error("Couldn't update machine");
    }
  }

  async delete(data: MachineDeletedMessage['data']): Promise<void> {
    this.schedulerRegistry.deleteInterval(data.serialNumber);

    try {
      await this.kepwareRepository.delete(data.serialNumber);
    } catch (err) {
      this.logger.error("Couldn't delete machine");
    }
  }

  @Timeout(10000)
  async bootstrapMachines(): Promise<void> {
    const machines = await this.kepwareRepository.findMany();

    machines.forEach((machine) =>
      this.startSymulation(machine.serialNumber, machine.productionRate),
    );

    this.logger.log('Finished bootstrapping machines');
  }

  private startSymulation(serialNumber: string, productionRate: number): void {
    this.schedulerRegistry.deleteInterval(serialNumber);

    const interval = setInterval(() => {
      this.logger.log(
        `Machine '${serialNumber}' status -> ${randomInt(10000)}`,
      );
    }, productionRate * 1000);

    this.schedulerRegistry.addInterval(serialNumber, interval);
  }
}
