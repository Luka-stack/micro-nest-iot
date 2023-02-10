import { Controller, Get } from '@nestjs/common';
import { MachineLabelsBo } from '../bos/machine-labels.bo';
import { MiscService } from '../services/misc.service';

@Controller('/misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('/machine-labels')
  findMachinesLabels(): Promise<MachineLabelsBo> {
    return this.miscService.findMachinesLabels();
  }
}
