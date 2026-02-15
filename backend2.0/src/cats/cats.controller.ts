import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cat created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all cats' })
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by ID' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cat found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cat not found' })
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cat updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cat not found' })
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cat deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cat not found' })
  remove(@Param('id') id: string) {
    return this.catsService.remove(id);
  }
}
