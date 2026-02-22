import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GeminiModule } from 'src/gemini/gemini.module';
import { Review, ReviewSchema } from './schemas/review.schema';
import { AuthModule } from 'src/auth/auth.module';
import { TitleGeneratorHelper } from './helpers/title-generator.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    GeminiModule,
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, TitleGeneratorHelper],
  exports: [ReviewsService],
})
export class ReviewsModule {}
