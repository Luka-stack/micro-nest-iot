import { Model } from '@prisma/db-machines';

type ModelWithRelations = Model & {
  type: { name: string };
  producent: { name: string };
};

export class MachineModelDto {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly producent: string,
  ) {}

  static from(model: ModelWithRelations): MachineModelDto {
    return new MachineModelDto(
      model.name,
      model.type.name,
      model.producent.name,
    );
  }

  static fromList(models: ModelWithRelations[]): MachineModelDto[] {
    return models.map((model) => MachineModelDto.from(model));
  }
}
