import { CommunicationModule } from '@iot/communication';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { ANALYSER_QUEUE } from './constants/queues';

import { KepwareController } from './kepware.controller';
import { KepwareService } from './services/kepware.service';
import { KepwareRepository } from './repositories/kepware.repository';
import { PrismaConnection } from './database/prisma-connection';
import { AnalyserService } from './services/analyser.service';

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
    CommunicationModule.register({ name: ANALYSER_QUEUE }),
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
