import { CommunicationModule } from '@iot/communication';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/devices/.env',
    }),
    CommunicationModule.register({ name: 'KEPWARE' }),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
