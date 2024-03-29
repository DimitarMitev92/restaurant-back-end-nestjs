import { RestaurantService } from './../restaurant/restaurant.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { MenuService } from 'src/menu/menu.service';
import { CategoryService } from 'src/category/category.service';
import { PackageService } from 'src/package/package.service';
import { Menu } from 'src/menu/entities/menu.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { MenuType } from 'src/menu-type/entities/menu-type.entity';
import moment from 'moment-timezone';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
    private readonly restaurantService: RestaurantService,
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

    const currentDateTime = moment();
    moment.tz.setDefault('Europe/Sofia');

    const startDateTime = moment(
      startDate + ' ' + startHour,
      'YYYY-MM-DD HH:mm:ss',
    );
    const endDateTime = moment(endDate + ' ' + endHour, 'YYYY-MM-DD HH:mm:ss');

    if (startDateTime.isAfter(endDateTime)) {
      throw new BadRequestException(
        'Start date and time cannot be after the end date and time',
      );
    }

    if (endDateTime.isBefore(currentDateTime)) {
      throw new BadRequestException(
        'End date and time cannot be before the current date and time',
      );
    }

    if (moment(startDate).isAfter(moment(endDate))) {
      throw new BadRequestException('Start date must be on or before end date');
    }

    if (startHour >= endHour) {
      throw new BadRequestException('Start hour must be before end hour');
    }

    const newMeal = this.mealRepo.create(createMealDto);
    return this.mealRepo.save(newMeal);
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
      return { restaurant: restaurant.name, menus: [] };
    }

    moment.tz.setDefault('Europe/Sofia');
    const currentDate = moment();

    const currentTime = currentDate.format('HH:mm:ss');
    const currentDateString = currentDate.format('YYYY-MM-DD');

    const meals = await this.entityManager
      .getRepository(Meal)
      .createQueryBuilder('meal')
      .where('meal.menuId IN (:...menuIds)', {
        menuIds: menus.map((menu) => menu.id),
      })
      .andWhere('meal.startDate <= :currentDate', {
        currentDate: currentDateString,
      })
      .andWhere('meal.endDate >= :currentDate', {
        currentDate: currentDateString,
      })
      .andWhere('meal.startHour <= :currentTime', { currentTime: currentTime })
      .andWhere('meal.endHour >= :currentTime', { currentTime: currentTime })
      .getMany();

    const menuTypeIds = menus.map((menu) => menu.menuTypeId);
    const menuTypes = await this.entityManager
      .getRepository(MenuType)
      .createQueryBuilder('menuType')
      .where('menuType.id IN (:...menuTypeIds)', { menuTypeIds })
      .getMany();

    if (meals.length === 0) {
      return {
        restaurant: restaurant.name,
        menus: menus.map((menu) => {
          const menuType = menuTypes.find(
            (type) => type.id === menu.menuTypeId,
          );
          return {
            id: menu.id,
            type: menuType ? menuType.type : 'Unknown',
            meals: [],
          };
        }),
      };
    }
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

  async findMealsByMenuId(
    menuId: string,
    restaurantId: string,
  ): Promise<{
    menu: { id: string; menuTypeId: string; menuType: string; meals: Meal[] };
  }> {
    const menu = await this.entityManager
      .getRepository(Menu)
      .createQueryBuilder('menu')
      .where('menu.id = :menuId', { menuId })
      .andWhere('menu.restaurantId = :restaurantId', { restaurantId })
      .getOne();

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }

    if (menu.restaurantId !== restaurantId) {
      throw new NotFoundException(
        `Menu with ID ${menuId} is not associated with restaurant ID ${restaurantId}`,
      );
    }

    const menuType = await this.entityManager
      .getRepository(MenuType)
      .createQueryBuilder('menuType')
      .where('menuType.id = :menuTypeId', { menuTypeId: menu.menuTypeId })
      .getOne();

    if (!menuType) {
      throw new NotFoundException(
        `MenuType with ID ${menu.menuTypeId} not found`,
      );
    }

    const meals = await this.entityManager
      .getRepository(Meal)
      .createQueryBuilder('meal')
      .where('meal.menuId = :menuId', { menuId })
      .getMany();

    if (meals.length === 0) {
      throw new NotFoundException(`No meals found for menu with ID ${menuId}`);
    }

    return {
      menu: {
        id: menu.id,
        menuTypeId: menu.menuTypeId,
        menuType: menuType.type,
        meals: meals,
      },
    };
  }

  async removeMealsByMenuId(menuId: string) {
    const meals = await this.mealRepo.find({
      where: { menuId },
    });
    return this.mealRepo.softRemove(meals);
  }

  async removeMealsByMenuIds(menuIds: string[]) {
    const meals = await this.mealRepo.find({
      where: { menuId: In(menuIds) },
    });
    return this.mealRepo.softRemove(meals);
  }
}
