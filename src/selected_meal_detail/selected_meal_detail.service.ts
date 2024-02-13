import { Injectable } from '@nestjs/common';
import { CreateSelectedMealDetailDto } from './dto/create-selected_meal_detail.dto';
import { UpdateSelectedMealDetailDto } from './dto/update-selected_meal_detail.dto';

@Injectable()
export class SelectedMealDetailService {
  create(createSelectedMealDetailDto: CreateSelectedMealDetailDto) {
    return 'This action adds a new selectedMealDetail';
  }

  findAll() {
    return `This action returns all selectedMealDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} selectedMealDetail`;
  }

  update(id: number, updateSelectedMealDetailDto: UpdateSelectedMealDetailDto) {
    return `This action updates a #${id} selectedMealDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} selectedMealDetail`;
  }
}
