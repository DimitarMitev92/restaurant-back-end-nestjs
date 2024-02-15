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
    const existingCategory = await this.restaurantRepo.findOne({
      where: { name: createRestaurantDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Restaurant with this type already exists');
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
