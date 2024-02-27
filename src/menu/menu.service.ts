import { RestaurantService } from './../restaurant/restaurant.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MenuType } from 'src/menu-type/entities/menu-type.entity';

export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectRepository(MenuType)
    private readonly menuTypeRepo: Repository<MenuType>,
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

  async findAllWithMenuType() {
    const menus = await this.menuRepo.find();
    const menusWithMenuType = await Promise.all(
      menus.map(async (menu) => {
        const menuType = await this.menuTypeRepo.findOneBy({
          id: menu.menuTypeId,
        });
        return {
          ...menu,
          menuTypeValue: menuType ? menuType.type : null,
        };
      }),
    );
    return menusWithMenuType;
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
  async fetchMenuByRestaurantId(restaurantId: string) {
    const restaurantExists = await this.restaurantService.findOne(restaurantId);
    if (!restaurantExists) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }

    const menus = await this.menuRepo
      .createQueryBuilder('menu')
      .where('menu.restaurantId = :restaurantId', { restaurantId })
      .innerJoin('MenuType', 'menuType', 'menu.menuTypeId = menuType.id')
      .select([
        'menu.id AS id',
        'menu.restaurantId AS restaurantId',
        'menuType.type AS menuTypeValue',
      ])
      .getRawMany();

    return menus;
  }

  async fetchRestaurantIdByMenuId(menuId: string): Promise<string> {
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }
    return menu.restaurantId;
  }
  async removeMenusByRestaurantId(restaurantId: string) {
    const menus = await this.menuRepo.find({ where: { restaurantId } });
    if (!menus) {
      throw new NotFoundException('Menus not found');
    }
    await this.menuRepo.softRemove(menus);
    return {
      menus,
      success: true,
      message: `Soft delete menus successful with restaurant id ${restaurantId}`,
    };
  }

  async findAllMenusByRestaurantId(restaurantId: string): Promise<Menu[]> {
    return this.menuRepo.find({
      where: { restaurantId: restaurantId },
    });
  }
}
