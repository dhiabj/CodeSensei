import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GeminiService } from '../gemini/gemini.service';
import { TitleGeneratorHelper } from './helpers/title-generator.helper';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private geminiService: GeminiService,
    private readonly titleGeneratorHelper: TitleGeneratorHelper,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<ReviewDocument> {
    const reviewResult = await this.geminiService.analyzeCode(
      createReviewDto.code,
      createReviewDto.language,
    );

    const review = new this.reviewModel({
      ...createReviewDto,
      title: this.titleGeneratorHelper.generateTitle(reviewResult),
      user: userId,
      language: createReviewDto.language || 'Unknown',
      reviewResult,
    });

    return review.save();
  }

  async findAll(userId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findOne({ _id: id, user: userId })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findOneAndUpdate({ _id: id, user: userId }, updateReviewDto, {
        new: true,
      })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async remove(id: string, userId: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findHistory(userId: string) {
    return this.reviewModel
      .find({ user: userId })
      .select('_id title createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
