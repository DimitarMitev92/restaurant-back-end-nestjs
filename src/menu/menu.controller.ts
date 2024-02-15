import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Public } from 'src/auth/public.decorator';
import { NotFoundException } from '@nestjs/common';
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Post('/create')
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return menu;
  }

  @Public()
  @Get()
  findAll(@Query('type') type: string) {
    return this.menuService.findAll(type);
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

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Public()
  @Delete(':id/soft')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for menu with id:${id}`);
    return this.menuService.removeSoft(id);
  }

  @Public()
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for menu with id :${id}`);
    return this.menuService.removePermanent(id);
  }
}
