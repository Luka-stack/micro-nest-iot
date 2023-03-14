import { RmqService } from '@iot/communication';
import { NestFactory } from '@nestjs/core';

import { AnalyserModule } from './analyser.module';
import { ANALYSER_QUEUE } from './constants/queues';

async function bootstrap() {
  const app = await NestFactory.create(AnalyserModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions(ANALYSER_QUEUE));

  await app.startAllMicroservices();
  await app.listen(7000);
}

bootstrap();
