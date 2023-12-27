import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class CommunicationModule {
  static register(opions: RmqModuleOptions[]): DynamicModule {
    return {
      module: CommunicationModule,
      imports: [
        ClientsModule.registerAsync(
          opions.map(({ name }) => ({
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          })),
        ),
      ],
      exports: [ClientsModule],
    };
  }
}
