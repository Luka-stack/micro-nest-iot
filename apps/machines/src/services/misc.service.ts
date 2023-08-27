import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { MachineModelDto } from '../dto/machine-model.dto';
import { MachineProducentDto } from '../dto/machine-producent.dto';
import { MachineTypeDto } from '../dto/machine-type.dto';
import { ResponseFiltersDto } from '../dto/outcoming/response-filters.dto';

import { MiscRepository } from '../repositories/misc.repository';

@Injectable()
export class MiscService {
  constructor(private readonly drizzleRepository: MiscRepository) {}

  async getAllFilters(): Promise<ResponseFiltersDto> {
    const [producents, types, models] = await Promise.all([
      this.drizzleRepository.findProducents(),
      this.drizzleRepository.findTypes(),
      this.drizzleRepository.findModels(),
    ]);

    return {
      data: {
        producents: plainToInstance(MachineProducentDto, producents),
        types: plainToInstance(MachineTypeDto, types),
        models: plainToInstance(MachineModelDto, models),
      },
    };
  }
}
