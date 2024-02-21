import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuTypeDto } from './dto/create-menu-type.dto';
import { UpdateMenuTypeDto } from './dto/update-menu-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuType } from './entities/menu-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuTypeService {
  constructor(
    @InjectRepository(MenuType) private menuTypeRepo: Repository<MenuType>,
  ) {}

  async create(createMenuTypeDto: CreateMenuTypeDto) {
    const existingMenuType = await this.menuTypeRepo.findOne({
      where: { type: createMenuTypeDto.type },
    });

    if (existingMenuType) {
      throw new BadRequestException('Type is already exists.');
    }

    const newMenuType = this.menuTypeRepo.create(createMenuTypeDto);
    return this.menuTypeRepo.save(newMenuType);
  }

  findAll() {
    return this.menuTypeRepo.find();
  }

  async findOne(id: string) {
    const menuType = await this.menuTypeRepo.findOneBy({ id });
    if (!menuType) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }
    return menuType;
  }

  async update(id: string, updateMenuTypeDto: UpdateMenuTypeDto) {
    const type = await this.findOne(id);

    if (!type) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }

    const updatedType = { ...type, ...updateMenuTypeDto };

    return this.menuTypeRepo.save(updatedType);
  }

  async removeSoft(id: string) {
    const type = await this.findOne(id);

    if (!type) {
      throw new NotFoundException(`Type not found`);
    }

    await this.menuTypeRepo.softRemove(type);
    return {
      success: true,
      message: `Soft delete type successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const type = await this.findOne(id);

    if (!type) {
      throw new NotFoundException('Type not found');
    }

    await this.menuTypeRepo.remove(type);
    return {
      success: true,
      message: `Permanent delete location successful with id ${id}`,
    };
  }
}
