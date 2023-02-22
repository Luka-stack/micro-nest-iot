import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { MachineModelDto } from '../dto/machine-model.dto';
import { MachineProducentDto } from '../dto/machine-producent.dto';
import { MachineTypeDto } from '../dto/machine-type.dto';
import { ResponseFiltersDto } from '../dto/outcoming/response-filters.dto';

import { MiscRepository } from '../repositories/misc.repository';

@Injectable()
export class MiscService {
  constructor(private readonly miscRepository: MiscRepository) {}

  async getAllFilters(): Promise<ResponseFiltersDto> {
    const [producents, types, models] = await Promise.all([
      this.miscRepository.findProducents(),
      this.miscRepository.findTypesIncludeProducent(),
      this.miscRepository.findModelsIncludeRelations(),
    ]);

    return {
      data: {
        producents: plainToInstance(MachineProducentDto, producents),
        types: MachineTypeDto.fromList(types),
        models: MachineModelDto.fromList(models),
      },
    };
  }
}
