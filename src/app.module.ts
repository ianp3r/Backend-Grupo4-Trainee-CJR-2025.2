import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProdutoService } from './produto/produto.service';
import { ProdutoModule } from './produto/produto.module';
import { CategoryModule } from './category/category.module';
import { ProductImageModule } from './product-image/product-image.module';
import { LojaModule } from './loja/loja.module';
import { CommentsModule } from './comments/comments.module';
import { StoreReviewsModule } from './store-reviews/store-reviews.module';
import { ProductReviewsModule } from './product-reviews/product-reviews.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProdutoModule,
    CategoryModule,
    ProductImageModule,
    LojaModule,
    CommentsModule,
    StoreReviewsModule,
    ProductReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProdutoService],
})
export class AppModule { }
