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
import moment from 'moment';

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

    const openHour = moment(createRestaurantDto.openHour, 'HH:mm:ss');
    const closeHour = moment(createRestaurantDto.closeHour, 'HH:mm:ss');

    if (!openHour.isBefore(closeHour)) {
      throw new BadRequestException('Open hour must be before close hour');
    }

    const newRestaurant = this.restaurantRepo.create(createRestaurantDto);
    return this.restaurantRepo.save(newRestaurant);
  }

  async findAll() {
    return this.restaurantRepo.find();
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

    if (
      updateRestaurantDto.name &&
      updateRestaurantDto.name !== restaurant.name
    ) {
      const existingRestaurant = await this.restaurantRepo.findOne({
        where: { name: updateRestaurantDto.name },
      });

      if (existingRestaurant) {
        throw new BadRequestException(
          'Another restaurant with this name already exists',
        );
      }
    }
    if (updateRestaurantDto.openHour && updateRestaurantDto.closeHour) {
      const openHour = moment(updateRestaurantDto.openHour, 'HH:mm:ss');
      const closeHour = moment(updateRestaurantDto.closeHour, 'HH:mm:ss');

      if (!openHour.isBefore(closeHour)) {
        throw new BadRequestException('Open hour must be before close hour');
      }
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
