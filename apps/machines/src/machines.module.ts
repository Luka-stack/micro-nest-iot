import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicationModule } from '@iot/communication';

import { MiscService } from './services/misc.service';
import { PrismaService } from './database/prisma.service';
import { MachinesService } from './services/machines.service';
import { MachinesController } from './controllers/machines.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/machines/.env',
    }),
    CommunicationModule.register({ name: 'KEPWARE' }),
  ],
  controllers: [MachinesController],
  providers: [MachinesService, MiscService, PrismaService],
})
export class MachinesModule {}
