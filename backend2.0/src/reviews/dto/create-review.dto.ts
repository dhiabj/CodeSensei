import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Title of the code review',
    example: 'User Authentication Function',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Code to be reviewed',
    example: 'function authenticate(user, password) { ... }',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Programming language',
    example: 'javascript',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;
}
