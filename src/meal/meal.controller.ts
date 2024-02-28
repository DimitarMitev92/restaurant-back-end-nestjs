import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { NotFoundException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRights } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@UseGuards(RolesGuard)
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Public()
  @Get('/newest')
  getNewestMeals() {
    return this.mealService.getNewestMeals();
  }

  @Roles([UserRights.ADMIN])
  @Post('/create')
  async create(@Body() createMealDto: CreateMealDto) {
    const meal = await this.mealService.create(createMealDto);
    return meal;
  }

  @Public()
  @Get('/restaurant/:restaurantId')
  async findMealsByRestaurantId(@Param('restaurantId') restaurantId: string) {
    try {
      return await this.mealService.findMealsByRestaurantId(restaurantId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.mealService.findAll();
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

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealService.update(id, updateMealDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mealService.removeSoft(id);
  }

  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    return this.mealService.removePermanent(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete('/by-menuId/:menuId')
  removeMealsByMenuId(@Param('menuId', ParseUUIDPipe) menuId: string) {
    return this.mealService.removeMealsByMenuId(menuId);
  }
}
