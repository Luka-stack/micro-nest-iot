import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommunicationModule } from '@iot/communication';

import { KepwareService } from './services/kepware.service';
import { AnalyserService } from './services/analyser.service';
import { PrismaConnection } from './database/prisma-connection';
import { KepwareController } from './kepware.controller';
import { KepwareRepository } from './repositories/kepware.repository';
import { ANALYSER_QUEUE, MACHINE_QUEUE } from './constants/queues';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_KEPWARE_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/kepware/.env',
    }),
    CommunicationModule,
    CommunicationModule.register([
      { name: ANALYSER_QUEUE },
      { name: MACHINE_QUEUE },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [KepwareController],
  providers: [
    KepwareService,
    PrismaConnection,
    AnalyserService,
    KepwareRepository,
  ],
})
export class KepwareModule {}
