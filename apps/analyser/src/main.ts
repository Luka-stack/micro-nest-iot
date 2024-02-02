import { RmqService } from '@iot/communication';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { ANALYSER_QUEUE } from './constants';
import { AnalyserModule } from './analyser.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyserModule);
  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get(ConfigService);

  app.connectMicroservice(rmqService.getOptions(ANALYSER_QUEUE));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}

bootstrap();
