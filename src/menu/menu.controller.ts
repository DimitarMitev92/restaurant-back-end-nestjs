import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Public } from 'src/auth/public.decorator';
import { NotFoundException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';

@Controller('menu')
@UseGuards(RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles([UserRights.ADMIN])
  @Post('/create')
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return menu;
  }

  @Public()
  @Get()
  findAll() {
    return this.menuService.findAllWithMenuType();
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const menu = await this.menuService.findOne(id);
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for menu with id:${id}`);
    return this.menuService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for menu with id :${id}`);
    return this.menuService.removePermanent(id);
  }

  @Public()
  @Get('/restaurant/:restaurantId')
  fetchMenuByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.menuService.fetchMenuByRestaurantId(restaurantId);
  }

  @Public()
  @Get('/fetch-restaurant/:menuId')
  async fetchRestaurantIdByMenuId(@Param('menuId') menuId: string) {
    try {
      const restaurantId =
        await this.menuService.fetchRestaurantIdByMenuId(menuId);
      return { restaurantId };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
