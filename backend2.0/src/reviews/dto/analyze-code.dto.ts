import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AnalyzeCodeDto {
  @ApiProperty({
    description: 'Code to be analyzed',
    example:
      'function authenticate(user, password) { return user.pass === password; }',
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
