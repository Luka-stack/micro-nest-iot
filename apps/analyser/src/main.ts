import { RmqService } from '@iot/communication';
import { NestFactory } from '@nestjs/core';

import { AnalyserModule } from './analyser.module';
import { ANALYSER_QUEUE } from './constants/queues';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AnalyserModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions(ANALYSER_QUEUE));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  await app.listen(7000);
}

bootstrap();
