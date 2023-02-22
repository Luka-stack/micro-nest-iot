import { Type as MachineType } from '@prisma/db-machines';

type TypeWithProducents = MachineType & {
  producents: {
    name: string;
  }[];
};

export class MachineTypeDto {
  constructor(readonly name: string, readonly producents: string[]) {}

  static from(model: TypeWithProducents): MachineTypeDto {
    return new MachineTypeDto(
      model.name,
      model.producents.map((prod) => prod.name),
    );
  }

  static fromList(models: TypeWithProducents[]): MachineTypeDto[] {
    return models.map((model) => MachineTypeDto.from(model));
  }
}
