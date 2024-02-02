import { Controller, Get, UseGuards } from '@nestjs/common';

import { MiscService } from '../services/misc.service';
import { ResponseFiltersDto } from '../dto/outcoming/response-filters.dto';
import { JwtAuthGuard } from '@iot/security';

@Controller('/misc')
@UseGuards(JwtAuthGuard)
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('/filters')
  getAllFilters(): Promise<ResponseFiltersDto> {
    return this.miscService.getAllFilters();
  }
}
