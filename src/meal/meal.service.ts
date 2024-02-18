import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Repository } from 'typeorm';
import { MenuService } from 'src/menu/menu.service';
import { CategoryService } from 'src/category/category.service';
import { PackageService } from 'src/package/package.service';
@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
  ) {}
  async create(createMealDto: CreateMealDto) {
    const {
      menuId,
      categoryId,
      packageId,
      startHour,
      endHour,
      startDate,
      endDate,
    } = createMealDto;

    const menuExists = await this.menuService.findOne(menuId);
    if (!menuExists) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }

    if (categoryId && !(await this.categoryService.findOne(categoryId))) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const packageExists = await this.packageService.findOne(packageId);
    if (!packageExists) {
      throw new NotFoundException(`Package with ID ${packageId} not found`);
    }

    const existingMeal = await this.mealRepo.findOne({
      where: {
        name: createMealDto.name,
        menuId: createMealDto.menuId,
        packageId: createMealDto.packageId,
        categoryId: createMealDto.categoryId,
      },
    });

    if (existingMeal) {
      throw new BadRequestException(
        `Meal with name ${createMealDto.name} already exists for this restaurant`,
      );
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be on or before end date');
    }
    const startHourMinutes = this.convertTimeToMinutes(startHour);
    const endHourMinutes = this.convertTimeToMinutes(endHour);

    if (startHourMinutes >= endHourMinutes) {
      throw new BadRequestException('Start hour must be before end hour');
    }
    const newMeal = this.mealRepo.create(createMealDto);
    return this.mealRepo.save(newMeal);
  }
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  findAll(name: string) {
    return this.mealRepo.find({ where: { name } });
  }

  async findOne(id: string): Promise<Meal> {
    const meal = await this.mealRepo.findOneBy({ id });
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return meal;
  }

  async update(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id);

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    const updatedMeal = { ...meal, ...updateMealDto };

    return this.mealRepo.save(updatedMeal);
  }

  async removeSoft(id: string) {
    const meal = await this.findOne(id);

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    await this.mealRepo.softRemove(meal);
    return {
      success: true,
      message: `Soft delete meal successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const meal = await this.findOne(id);

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    await this.mealRepo.remove(meal);
    return {
      success: true,
      message: `Permanent delete meal successful with id ${id}`,
    };
  }

  async findMostOrderedMeal() {
    const mostOrderedMeal = await this.mealRepo
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.menu', 'menu')
      .leftJoinAndSelect('menu.restaurant', 'restaurant')
      .leftJoin('meal.orderDetails', 'orderDetail')
      .select('meal.id', 'meal_id')
      .addSelect('meal.name', 'meal_name')
      .addSelect('restaurant.name', 'restaurant_name')
      .addSelect('COUNT(orderDetail.mealId)', 'order_count')
      .groupBy('meal.id')
      .addGroupBy('restaurant.name')
      .orderBy('order_count', 'DESC')
      .limit(1)
      .getRawOne();

    return mostOrderedMeal;
  }
}
