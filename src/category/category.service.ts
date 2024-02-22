import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepo.findOne({
      where: { type: createCategoryDto.type },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this type already exists');
    }

    const newCategory = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(newCategory);
  }

  async findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    const updatedCategory = { ...category, ...updateCategoryDto };

    return this.categoryRepo.save(updatedCategory);
  }

  async removeSoft(id: string) {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepo.softRemove(category);
    return {
      success: true,
      message: `Soft delete category successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepo.remove(category);
    return {
      success: true,
      message: `Permanent delete category successful with id ${id}`,
    };
  }
}
