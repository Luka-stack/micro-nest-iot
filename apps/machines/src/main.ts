import { RmqService } from '@iot/communication';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { MACHINE_QUEUE } from './constants';
import { MachinesModule } from './machines.module';

async function bootstrap() {
  const app = await NestFactory.create(MachinesModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const rmqService = app.get(RmqService);
  const configService = app.get(ConfigService);

  app.connectMicroservice(rmqService.getOptions(MACHINE_QUEUE));

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}

bootstrap();
