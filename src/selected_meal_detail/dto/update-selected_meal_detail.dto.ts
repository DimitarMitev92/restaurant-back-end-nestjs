import { PartialType } from '@nestjs/mapped-types';
import { CreateSelectedMealDetailDto } from './create-selected_meal_detail.dto';

export class UpdateSelectedMealDetailDto extends PartialType(CreateSelectedMealDetailDto) {}
