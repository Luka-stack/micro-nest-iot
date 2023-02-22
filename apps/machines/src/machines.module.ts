import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicationModule } from '@iot/communication';

import { MiscService } from './services/misc.service';
import { PrismaService } from './repositories/prisma.service';
import { MachinesService } from './services/machines.service';
import { MachinesController } from './controllers/machines.controller';
import { MachinesRepository } from './repositories/machines.repository';
import { MiscRepository } from './repositories/misc.repository';
import { KEPWARE_QUEUE } from './constants/queues';
import { KepwareService } from './services/kepware.service';
import { MiscController } from './controllers/misc.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/machines/.env',
    }),
    CommunicationModule.register({ name: KEPWARE_QUEUE }),
  ],
  controllers: [MachinesController, MiscController],
  providers: [
    MachinesService,
    MiscService,
    PrismaService,
    MachinesRepository,
    MiscRepository,
    KepwareService,
  ],
})
export class MachinesModule {}
