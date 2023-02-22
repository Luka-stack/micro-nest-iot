import { Controller, Get } from '@nestjs/common';
import { ResponseFiltersDto } from '../dto/outcoming/response-filters.dto';

import { MiscService } from '../services/misc.service';

@Controller('/misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('/filters')
  getAllFilters(): Promise<ResponseFiltersDto> {
    return this.miscService.getAllFilters();
  }
}
