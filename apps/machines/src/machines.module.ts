import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@iot/database';
import { SecurityModule } from '@iot/security';
import { CommunicationModule } from '@iot/communication';

import * as schema from './database/schema';
import { MiscService } from './services/misc.service';
import { KepwareService } from './services/kepware.service';
import { MiscController } from './controllers/misc.controller';
import { MiscRepository } from './repositories/misc.repository';
import { MachinesService } from './services/machines.service';
import { MachinesController } from './controllers/machines.controller';
import { MachinesRepository } from './repositories/machines.repository';
import {
  JWT_EXPIRATION,
  JWT_SECRET,
  KEPWARE_QUEUE,
  PG_CONNECTION,
} from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/machines/.env',
    }),
    SecurityModule.register({
      secret: JWT_SECRET,
      expiresInSeconds: JWT_EXPIRATION,
    }),
    CommunicationModule.register([{ name: KEPWARE_QUEUE }]),
    DrizzleModule.register({ name: PG_CONNECTION, schema }),
  ],
  controllers: [MachinesController, MiscController],
  providers: [
    MachinesService,
    MiscService,
    MachinesRepository,
    MiscRepository,
    KepwareService,
  ],
})
export class MachinesModule {}
