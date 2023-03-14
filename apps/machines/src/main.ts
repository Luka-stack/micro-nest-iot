import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MachinesModule } from './machines.module';

async function bootstrap() {
  const app = await NestFactory.create(MachinesModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  // const rmqService = app.get(RmqService);
  const configService = app.get(ConfigService);

  // app.connectMicroservice<RmqOptions>(rmqService.getOptions('DEVICE', true));

  // await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
