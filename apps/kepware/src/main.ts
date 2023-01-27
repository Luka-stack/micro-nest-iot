import { RmqService } from '@iot/communication';
import { NestFactory } from '@nestjs/core';
import { KepwareModule } from './kepware.module';

async function bootstrap() {
  const app = await NestFactory.create(KepwareModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('KEPWARE'));

  await app.startAllMicroservices();
}

bootstrap();
