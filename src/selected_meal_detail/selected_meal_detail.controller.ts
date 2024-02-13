import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelectedMealDetailService } from './selected_meal_detail.service';
import { CreateSelectedMealDetailDto } from './dto/create-selected_meal_detail.dto';
import { UpdateSelectedMealDetailDto } from './dto/update-selected_meal_detail.dto';

@Controller('selected-meal-detail')
export class SelectedMealDetailController {
  constructor(private readonly selectedMealDetailService: SelectedMealDetailService) {}

  @Post()
  create(@Body() createSelectedMealDetailDto: CreateSelectedMealDetailDto) {
    return this.selectedMealDetailService.create(createSelectedMealDetailDto);
  }

  @Get()
  findAll() {
    return this.selectedMealDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selectedMealDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelectedMealDetailDto: UpdateSelectedMealDetailDto) {
    return this.selectedMealDetailService.update(+id, updateSelectedMealDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.selectedMealDetailService.remove(+id);
  }
}
