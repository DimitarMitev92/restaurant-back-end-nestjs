import { RestaurantService } from './../restaurant/restaurant.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    private readonly restaurantService: RestaurantService,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const { restaurantId } = createMenuDto;
    const restaurant = await this.restaurantService.findOne(restaurantId);
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${createMenuDto.restaurantId} not found`,
      );
    }
    const existingMenu = await this.menuRepo.findOne({
      where: {
        menuTypeId: createMenuDto.menuTypeId,
        restaurantId: createMenuDto.restaurantId,
      },
    });

    if (existingMenu) {
      throw new BadRequestException(
        `Menu with type this type already exists for this restaurant`,
      );
    }

    const newMenu = this.menuRepo.create(createMenuDto);
    return this.menuRepo.save(newMenu);
  }

  findAll() {
    return this.menuRepo.find();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    const updatedMenu = { ...menu, ...updateMenuDto };

    return this.menuRepo.save(updatedMenu);
  }

  async removeSoft(id: string) {
    const menu = await this.findOne(id);

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.menuRepo.softRemove(menu);
    return {
      success: true,
      message: `Soft delete menu successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const menu = await this.findOne(id);

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.menuRepo.remove(menu);
    return {
      success: true,
      message: `Permanent delete menu successful with id ${id}`,
    };
  }
}
