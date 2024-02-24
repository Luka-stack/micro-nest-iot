import { Machine } from '@prisma/db-kepware';

export class WorkingMachine {
  private static WORK_INTERVAL_SUFIX = 'work';
  private static UTILIZATON_INTERVAL_SUFIX = 'util';

  private base: number;

  constructor(private readonly baseMachine: Machine) {
    this.base = baseMachine.workBase;
  }

  get machine(): Machine {
    return this.baseMachine;
  }

  get workInterval(): string {
    return `${this.baseMachine.serialNumber}-${WorkingMachine.WORK_INTERVAL_SUFIX}`;
  }

  get utilizationInterval(): string {
    return `${this.baseMachine.serialNumber}-${WorkingMachine.UTILIZATON_INTERVAL_SUFIX}`;
  }

  update(data: { productionRate?: number; nextMaintenance?: string }) {
    this.baseMachine.productionRate =
      data.productionRate || this.baseMachine.productionRate;

    this.baseMachine.nextMaintenance = data.nextMaintenance
      ? new Date(data.nextMaintenance)
      : this.baseMachine.nextMaintenance;
  }

  simulateMachineWork(): number {
    const { defaultRate, productionRate, workRange } = this.baseMachine;

    const timeElapsed = 10;
    const decay =
      defaultRate - productionRate > 0 ? (defaultRate - productionRate) / 4 : 0;

    const degradedBase = this.base - decay * timeElapsed;
    const work = degradedBase - workRange + 2 * workRange * Math.random();

    this.base = degradedBase;

    return work;
  }

  rateBreakeChance(): number {
    const { productionRate, defaultRate, maxRate, faultRate } =
      this.baseMachine;

    if (productionRate === maxRate) {
      return 0.3;
    } else if (productionRate < defaultRate) {
      const difference = (productionRate - maxRate) / (defaultRate - maxRate);
      return (defaultRate - maxRate) * difference * faultRate;
    } else {
      return faultRate;
    }
  }

  maintenanceBreakeChance(): number {
    const now = new Date();
    const timeDiff = this.baseMachine.nextMaintenance.getTime() - now.getTime();

    if (timeDiff > 0) {
      const diffInDays = timeDiff / (1000 * 3600 * 24);
      return 2.5 / diffInDays;
    } else if (timeDiff == 0) {
      return 0.3;
    } else {
      const diffInDays = Math.abs(timeDiff) / (1000 * 3600 * 24);
      return diffInDays / 0.03;
    }
  }
}
