import { Injectable } from '@nestjs/common';

import { MachineLabelsBo } from '../bos/machine-labels.bo';
import { MiscRepository } from '../repositories/misc.repository';

@Injectable()
export class MiscService {
  constructor(private readonly miscRepository: MiscRepository) {}

  async findMachinesLabels(): Promise<MachineLabelsBo> {
    const data = await Promise.all([
      this.miscRepository.findProducents(),
      this.miscRepository.findTypes(),
      this.miscRepository.findModels(),
    ]);

    const machineLabels = new MachineLabelsBo();
    machineLabels.machineProducents = data[0];
    machineLabels.machineTypes = data[1];
    machineLabels.machineModels = data[2];

    return machineLabels;
  }
}
