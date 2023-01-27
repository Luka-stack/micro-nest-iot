import { Body, Controller, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  changeStatus(@Body() request: { name: string; on: boolean }) {
    return this.devicesService.changeStatus(request);
  }
}
