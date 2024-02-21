import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const existingRestaurant = await this.restaurantRepo.findOne({
      where: { name: createRestaurantDto.name },
    });

    if (existingRestaurant) {
      throw new BadRequestException('Restaurant with this name already exists');
    }

    const newRestaurant = this.restaurantRepo.create(createRestaurantDto);
    return this.restaurantRepo.save(newRestaurant);
  }

  async findAll(name: string) {
    return this.restaurantRepo.find({ where: { name } });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async findMealsByResId(id: string) {
    const restaurant = await this.restaurantRepo.findOneBy({ id });

    //DO NOT DELETE YET!!!
    // const queryBuilder = this.restaurantRepo.createQueryBuilder('');

    // const query = await this.restaurantRepo
    //   .createQueryBuilder('getAllMeals')
    //   .select('menu,meal')
    //   .from(Menu, 'menu')
    //   .leftJoin(Meal, 'meal', 'menu.id = meal.menu_id')
    //   .where(`menu.restaurant_id = :id`, { id: id })
    //   .getQuery();
    // return query;

    //TO DO: Fix the query so that you don't need to do a new object structure
    const query = `
         SELECT menu.id AS "menuId", menu.type, meal.*
         FROM menu
         LEFT JOIN meal ON menu.id = meal.menu_id
         WHERE menu.restaurant_id = '${id}'
`;

    const queryResult = await this.restaurantRepo.query(query);
    const result = {};
    result['restaurant'] = restaurant.name;
    result['menus'] = [];
    queryResult.forEach((meal) => {
      if (!result['menus'].some((e) => e.name === meal.type)) {
        const mealObj = {
          name: meal.type,
          id: meal.menuId,
        };

        const mappedResult = queryResult.filter(
          (meal) => meal.type == mealObj.name,
        );
        const mealArr = mappedResult.map((meal) => {
          if (meal.type == mealObj.name) {
            return {
              id: meal.id,
              name: meal.name,
              picture: meal.picture,
              description: meal.description,
              additionalNote: meal.additional_note,
              startDate: meal.start_date,
              endDate: meal.end_date,
              startHour: meal.start_hour,
              endHour: meal.end_hour,
              price: meal.price,
              weight: meal.weight,
              categoryId: meal.category_id,
              packageId: meal.package_id,
            };
          }
        });

        mealObj['meals'] = mealArr;
        result['menus'].push(mealObj);
      }
    });
    return result;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    const updatedRestaurant = { ...restaurant, ...updateRestaurantDto };

    return this.restaurantRepo.save(updatedRestaurant);
  }

  async removeSoft(id: string) {
    const restaurant = await this.findOne(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    await this.restaurantRepo.softRemove(restaurant);
    return {
      success: true,
      message: `Soft delete restaurant successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const restaurant = await this.findOne(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    await this.restaurantRepo.remove(restaurant);
    return {
      success: true,
      message: `Permanent delete restaurant successful with id ${id}`,
    };
  }

  async findRestaurantsByLocationId(locationId: string) {
    return await this.restaurantRepo.find({
      where: { locationId: locationId },
    });
  }
}
