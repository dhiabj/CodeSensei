import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ example: 'Whiskers', description: 'The name of the cat' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3, description: 'The age of the cat' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 'Persian', description: 'The breed of the cat' })
  @IsString()
  breed: string;
}
