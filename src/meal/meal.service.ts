import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { EntityManager, Repository } from 'typeorm';
import { MenuService } from 'src/menu/menu.service';
import { CategoryService } from 'src/category/category.service';
import { PackageService } from 'src/package/package.service';
import { Menu } from 'src/menu/entities/menu.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { MenuType } from 'src/menu-type/entities/menu-type.entity';
@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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

    const endDateObject = new Date(createMealDto.endDate);
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const endHourMinutes = this.convertTimeToMinutes(endHour);
    endDateObject.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const [endHours, endMinutes] = createMealDto.endHour.split(':').map(Number);
    endDateObject.setHours(endHours, endMinutes, 0, 0);

    if (endDateObject < currentDate) {
      throw new BadRequestException(
        'End date and time cannot be before the current date and time',
      );
    } else if (endDateObject.toDateString() === currentDate.toDateString()) {
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      if (endHourMinutes <= currentTimeInMinutes) {
        throw new BadRequestException(
          'End time cannot be in the past on the current day',
        );
      }
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be on or before end date');
    }
    const startHourMinutes = this.convertTimeToMinutes(startHour);

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

  findAll() {
    return this.mealRepo.find();
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

  async getMealPriceById(mealId: string) {
    const meal = await this.mealRepo.findOne({ where: { id: mealId } });
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`);
    }
    let packagePrice = 0;

    if (meal.packageId) {
      packagePrice = await this.packageService.getPackagePriceById(
        meal.packageId,
      );
    }
    return meal.price + packagePrice;
  }

  async allMealsFromSameRestaurant(mealIds: string[], restaurantId: string) {
    const queryBuilder = this.mealRepo.createQueryBuilder('meal');

    queryBuilder
      .leftJoin('menu', 'menu', 'meal.menu_id = menu.id')
      .where('meal.id IN (:...mealIds)', { mealIds })
      .andWhere('menu.restaurantId = :restaurantId', { restaurantId });

    const count = await queryBuilder.getCount();
    return count === mealIds.length;
  }

  async getNewestMeals(): Promise<Meal[]> {
    const newestMeals = await this.mealRepo.find({
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });

    if (newestMeals.length === 0) {
      throw new NotFoundException('No meals found');
    }

    return newestMeals;
  }

  private isMealAvailable(
    meal: Meal,
    currentDate: Date,
    currentTimeInMinutes: number,
  ) {
    const startDate = new Date(meal.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(meal.endDate);
    endDate.setHours(0, 0, 0, 0);
    const [startHours, startMinutes] = meal.startHour.split(':').map(Number);
    const startHourInMinutes = startHours * 60 + startMinutes;
    const [endHours, endMinutes] = meal.endHour.split(':').map(Number);
    const endHourInMinutes = endHours * 60 + endMinutes;

    if (currentDate < startDate || currentDate > endDate) {
      return false;
    }

    if (
      currentDate.getTime() === startDate.getTime() ||
      currentDate.getTime() === endDate.getTime()
    ) {
      if (
        currentTimeInMinutes < startHourInMinutes ||
        currentTimeInMinutes > endHourInMinutes
      ) {
        return false;
      }
    }

    return true;
  }

  async findMealsByRestaurantId(restaurantId: string) {
    const restaurant = await this.entityManager
      .getRepository(Restaurant)
      .createQueryBuilder('restaurant')
      .select('restaurant.name')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .getOne();

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }

    const menus = await this.entityManager
      .getRepository(Menu)
      .createQueryBuilder('menu')
      .where('menu.restaurantId = :restaurantId', { restaurantId })
      .getMany();

    if (menus.length === 0) {
      throw new NotFoundException(
        `No menus found for restaurant with ID ${restaurantId}`,
      );
    }

    const menuIds = menus.map((menu) => menu.id);
    const meals = await this.entityManager
      .getRepository(Meal)
      .createQueryBuilder('meal')
      .where('meal.menuId IN (:...menuIds)', { menuIds })
      .getMany();

    if (meals.length === 0) {
      throw new NotFoundException(
        `No meals found for menus of restaurant with ID ${restaurantId}`,
      );
    }

    const menuTypeIds = menus.map((menu) => menu.menuTypeId);
    const menuTypes = await this.entityManager
      .getRepository(MenuType)
      .createQueryBuilder('menuType')
      .where('menuType.id IN (:...menuTypeIds)', { menuTypeIds })
      .getMany();

    menuTypes.forEach((menuType) => console.log(menuType.type));

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    const response = {
      restaurant: restaurant.name,
      menus: menus.map((menu) => {
        const menuType = menuTypes.find(
          (type) => type.id === menu.menuTypeId,
        )?.type;
        return {
          id: menu.id,
          type: menuType,
          meals: meals
            .filter((meal) => meal.menuId === menu.id)
            .filter((meal) =>
              this.isMealAvailable(meal, currentDate, currentTimeInMinutes),
            )
            .map((meal) => ({
              id: meal.id,
              name: meal.name,
              picture: meal.picture,
              description: meal.description,
              startDate: meal.startDate,
              endDate: meal.endDate,
              startHour: meal.startHour,
              endHour: meal.endHour,
              price: meal.price,
              weight: meal.weight,
              categoryId: meal.categoryId,
              packageId: meal.packageId,
            })),
        };
      }),
    };

    return response;
  }
}
