import { CommunicationModule } from '@iot/communication';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

import { KepwareController } from './kepware.controller';
import { KepwareService } from './kepware.service';
import { KepwareRepository } from './repositories/kepware.repository';
import { PrismaService } from './repositories/prisma.service';

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
    ScheduleModule.forRoot(),
  ],
  controllers: [KepwareController],
  providers: [KepwareService, PrismaService, KepwareRepository],
})
export class KepwareModule {}
