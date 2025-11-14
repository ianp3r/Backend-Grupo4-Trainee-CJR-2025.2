import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // $on typings can be strict depending on generated client; cast to any to ensure the runtime hook is registered
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
