import { MenuModule } from './../menu/menu.module';
import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { PackageModule } from 'src/package/package.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    CategoryModule,
    MenuModule,
    PackageModule,
    TypeOrmModule.forFeature([Meal]),
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
