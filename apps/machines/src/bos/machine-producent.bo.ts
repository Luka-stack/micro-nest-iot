import { Producent as ProducentModel } from '@prisma/db-machines';

export class MachineProducentBo implements ProducentModel {
  id: number;
  name: string;

  static from(producent: ProducentModel): MachineProducentBo {
    const producentBo = new MachineProducentBo();

    producentBo.id = producent.id;
    producentBo.name = producent.name;

    return producentBo;
  }

  static fromList(producents: ProducentModel[]): MachineProducentBo[] {
    return producents.map((prod) => MachineProducentBo.from(prod));
  }
}
