import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Public } from 'src/auth/public.decorator';
import { NotFoundException } from '@nestjs/common';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Public()
  @Post('/create')
  async create(@Body() createMealDto: CreateMealDto) {
    const meal = await this.mealService.create(createMealDto);
    return meal;
  }

  @Public()
  @Get()
  findAll(@Query('name') name: string) {
    return this.mealService.findAll(name);
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const meal = await this.mealService.findOne(id);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    return meal;
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealService.update(id, updateMealDto);
  }

  @Public()
  @Delete(':id/soft')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for meal with id:${id}`);
    return this.mealService.removeSoft(id);
  }

  @Public()
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for menu with id :${id}`);
    return this.mealService.removePermanent(id);
  }
}
