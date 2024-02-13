import { Module } from '@nestjs/common';
import { SelectedMealDetailService } from './selected_meal_detail.service';
import { SelectedMealDetailController } from './selected_meal_detail.controller';

@Module({
  controllers: [SelectedMealDetailController],
  providers: [SelectedMealDetailService],
})
export class SelectedMealDetailModule {}
