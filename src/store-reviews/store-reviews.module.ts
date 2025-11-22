import { Module } from '@nestjs/common';
import { StoreReviewsService } from './store-reviews.service';
import { StoreReviewsController } from './store-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StoreReviewsController],
  providers: [StoreReviewsService],
})
export class StoreReviewsModule {}
