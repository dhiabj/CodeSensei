import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { type Request as ExpressRequest } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GeminiService } from 'src/gemini/gemini.service';
import { AnalyzeCodeDto } from './dto/analyze-code.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly geminiService: GeminiService,
  ) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze code without authentication (does not save to database)',
    description:
      'Anyone can use this endpoint to get instant code review feedback without creating an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Code analysis completed successfully',
    schema: {
      type: 'object',
      properties: {
        reviewResult: {
          type: 'string',
          example:
            '❌ Bad Code...\n🔍 Issues...\n✅ Recommended Fix...\n💡 Improvements...',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiBody({ type: AnalyzeCodeDto })
  async analyzeCode(@Body() analyzeCodeDto: AnalyzeCodeDto) {
    const reviewResult = await this.geminiService.analyzeCode(
      analyzeCodeDto.code,
      analyzeCodeDto.language,
    );

    return { reviewResult };
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new code review' })
  @ApiResponse({
    status: 201,
    description: 'Code review created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({ type: CreateReviewDto })
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: ExpressRequest,
  ) {
    const userId = (request.user as JwtPayload).sub;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all reviews',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Req() request: ExpressRequest) {
    const userId = (request.user as JwtPayload).sub;
    return this.reviewsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the review',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string, @Req() request: ExpressRequest) {
    const userId = (request.user as JwtPayload).sub;
    return this.reviewsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({ type: UpdateReviewDto })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() request: ExpressRequest,
  ) {
    const userId = (request.user as JwtPayload).sub;
    return this.reviewsService.update(id, updateReviewDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @Req() request: ExpressRequest) {
    const userId = (request.user as JwtPayload).sub;
    return this.reviewsService.remove(id, userId);
  }
}
