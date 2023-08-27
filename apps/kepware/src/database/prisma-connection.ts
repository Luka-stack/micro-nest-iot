import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/db-kepware';

@Injectable()
export class PrismaConnection extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
