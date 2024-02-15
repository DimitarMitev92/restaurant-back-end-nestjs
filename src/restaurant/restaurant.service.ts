import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const newWarehouse =
        this.restaurantRepository.create(createRestaurantDto);
      return await this.restaurantRepository.save(newWarehouse);
    } catch (error) {
      throw new BadRequestException('Impossible create', error);
    }
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepository.find({
      where: { deletedAt: null },
    });
    if (restaurants.length === 0) {
      throw new NotFoundException('DB is empty!');
    }
    return restaurants;
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!restaurant) {
      throw new NotFoundException(`Warehouse not found.`);
    }
    return restaurant;
  }

  async update(id: string, attrs: Partial<Restaurant>) {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id, deletedAt: null },
      });
      if (!restaurant) {
        throw new NotFoundException(`Restaurant not found!`);
      }
      const updatedRestaurant = { ...restaurant, ...attrs };
      await this.restaurantRepository.save(updatedRestaurant);
      return updatedRestaurant;
    } catch (error) {
      throw new BadRequestException('Update not executed', error);
    }
  }

  async remove(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found.`);
    }
    restaurant.deletedAt = new Date();
    console.log('Successfully removed record.');
    return await this.restaurantRepository.save(restaurant);
  }

  async permanentDelete(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found.`);
    }
    console.log(`Warehouse permanently removed.`);
    return await this.restaurantRepository.remove(restaurant);
  }
}
