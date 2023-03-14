import { SchedulerRegistry } from '@nestjs/schedule';
import { Machine } from '@prisma/db-kepware';
import { AnalyserService } from '../services/analyser.service';

export class WorkingMachine {
  private base: number;
  private range: number;
  private decreaseFactor = 0.999;

  constructor(
    private readonly machine: Machine,
    private readonly scheduler: SchedulerRegistry,
    private readonly analyserService: AnalyserService,
  ) {
    this.base = machine.workBase;
    this.range = machine.workRange;
  }

  updateSimulation(productionRate: number): void {
    if (this.scheduler.doesExist('interval', this.machine.serialNumber)) {
      this.scheduler.deleteInterval(this.machine.serialNumber);
    }

    this.machine.productionRate = productionRate;
    this.startSimulation();
  }

  startSimulation(): void {
    this.analyserService.emitStatusChange({
      serialNumber: this.machine.serialNumber,
      status: 'WORKING',
    });

    const interval = setInterval(() => {
      const [work, newBase] = WorkingMachine.simulateOrbiting(
        this.base,
        this.range,
        this.decreaseFactor,
      );

      this.base = newBase;
      this.analyserService.emitProducedData({
        serialNumber: this.machine.serialNumber,
        work,
      });
    }, this.machine.productionRate * 1000);

    this.scheduler.addInterval(this.machine.serialNumber, interval);
  }

  stopSimulation(): void {
    if (this.scheduler.doesExist('interval', this.machine.serialNumber)) {
      this.scheduler.deleteInterval(this.machine.serialNumber);

      this.analyserService.emitStatusChange({
        serialNumber: this.machine.serialNumber,
        status: 'IDLE',
      });
    }
  }

  private static simulateOrbiting(
    base: number,
    range: number,
    decreaseFactor: number,
  ): [number, number] {
    const randomNumber =
      Math.random() * (base + range - (base - range)) + (base - range);

    base *= decreaseFactor;

    return [randomNumber, base];
  }
}
