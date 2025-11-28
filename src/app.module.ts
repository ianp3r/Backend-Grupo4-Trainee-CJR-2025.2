import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProdutoService } from './produto/produto.service';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProdutoService],
})
export class AppModule { }
