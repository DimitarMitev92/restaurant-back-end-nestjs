import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public } from 'src/auth/public.decorator';
import { UserRights } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles([UserRights.ADMIN])
  @Post('/create')
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(createRestaurantDto);
    return restaurant;
  }

  @Public()
  @Get()
  findAll(@Query('name') name: string) {
    return this.restaurantService.findAll(name);
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findOne(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  @Public()
  @Get('/:id/meals')
  async findMealsByRestourant(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findMealsByResId(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  @Patch(':id')
  @Roles([UserRights.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for restaurant with id:${id}`);
    return this.restaurantService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for restaurant with id :${id}`);
    return this.restaurantService.removePermanent(id);
  }

  @Public()
  @Get('/byLocationId/:locationId')
  fetchRestaurantsByLocationId(@Param('locationId') locationId: string) {
    return this.restaurantService.findRestaurantsByLocationId(locationId);
  }
}
