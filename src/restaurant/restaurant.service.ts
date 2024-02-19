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
import { Menu } from 'src/menu/entities/menu.entity';
import { Meal } from 'src/meal/entities/meal.entity';

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
    await this.restaurantRepo.findOneBy({ id });

    const queryBuilder = this.restaurantRepo.createQueryBuilder('test');

    const query = await queryBuilder
      .select([
        'menu',
        'meal', // Include meal columns you need
      ])
      .from(Meal, 'meal')
      .innerJoin(Menu, 'menu', 'meal.menu_id = menu.id')
      .innerJoin(Restaurant, 'res', `menu.restaurant_id = '${id}'`)
      .orderBy('menu.type')
      .getRawMany();

    console.log(query);

    return query;
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
}
