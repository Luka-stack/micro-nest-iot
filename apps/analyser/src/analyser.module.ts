import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { CommunicationModule } from '@iot/communication';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MONGODB_URI } from './constants/database';
import { AnalyserService } from './analyser.service';
import { Work, WorkSchema } from './schema/work.schema';
import { AnalyserController } from './analyser.controller';
import { Utilization, UtilizationSchema } from './schema/utilization.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ANALYSER_QUEUE: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/analyser/.env',
    }),
    CommunicationModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Work.name, schema: WorkSchema },
      { name: Utilization.name, schema: UtilizationSchema },
    ]),
  ],
  controllers: [AnalyserController],
  providers: [AnalyserService],
})
export class AnalyserModule {}
