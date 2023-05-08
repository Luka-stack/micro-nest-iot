import { SchedulerRegistry } from '@nestjs/schedule';
import { Machine } from '@prisma/db-kepware';
import { AnalyserService } from '../services/analyser.service';

export class WorkingMachine {
  private static WORK_INTERVAL_SUFIX = 'work';
  private static UTILIZATON_INTERVAL_SUFIX = 'util';

  private base: number;

  constructor(
    private readonly machine: Machine,
    private readonly scheduler: SchedulerRegistry,
    private readonly analyserService: AnalyserService,
  ) {
    this.base = machine.workBase;
  }

  updateSimulation(productionRate: number): void {
    if (
      this.scheduler.doesExist(
        'interval',
        `${this.machine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`,
      )
    ) {
      this.scheduler.deleteInterval(
        `${this.machine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`,
      );
    }

    this.machine.productionRate = productionRate;
    this.startSimulation();
  }

  startSimulation(): void {
    const workInterval = setInterval(() => {
      const [work, newBase] = WorkingMachine.simulateMachineWork(
        this.base,
        this.machine.workRange,
        this.machine.defaultRate,
        this.machine.productionRate,
      );

      this.base = newBase;
      this.analyserService.emitMachineWork({
        serialNumber: this.machine.serialNumber,
        work,
      });
    }, this.machine.productionRate * 1000);

    const utilizationInterval = setInterval(() => {
      this.analyserService.emitMachineUtilization({
        serialNumber: this.machine.serialNumber,
        utilization: 60,
      });
    }, 60 * 1000);

    this.scheduler.addInterval(
      `${this.machine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`,
      workInterval,
    );
    this.scheduler.addInterval(
      `${this.machine.serialNumber}-${WorkingMachine.UTILIZATON_INTERVAL_SUFIX}`,
      utilizationInterval,
    );
  }

  stopSimulation(): void {
    if (
      this.scheduler.doesExist(
        'interval',
        `${this.machine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`,
      )
    ) {
      this.scheduler.deleteInterval(
        `${this.machine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`,
      );
    }

    if (
      this.scheduler.doesExist(
        'interval',
        `${this.machine.serialNumber}-${WorkingMachine.UTILIZATON_INTERVAL_SUFIX}`,
      )
    ) {
      this.scheduler.deleteInterval(
        `${this.machine.serialNumber}-${WorkingMachine.UTILIZATON_INTERVAL_SUFIX}`,
      );
    }
  }

  private static simulateMachineWork(
    base: number,
    range: number,
    defaultRate: number,
    rate: number,
  ): [number, number] {
    const timeElapsed = 10;
    const decay = defaultRate - rate > 0 ? (defaultRate - rate) / 4 : 0;

    const degradedBase = base - decay * timeElapsed;
    const work = degradedBase - range + 2 * range * Math.random();

    return [work, degradedBase];
  }
}
