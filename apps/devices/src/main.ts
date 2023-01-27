import { RmqService } from '@iot/communication';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { DevicesModule } from './devices.module';

async function bootstrap() {
  const app = await NestFactory.create(DevicesModule);

  // const rmqService = app.get(RmqService);
  const configService = app.get(ConfigService);

  // app.connectMicroservice<RmqOptions>(rmqService.getOptions('DEVICE', true));

  // await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}

bootstrap();
