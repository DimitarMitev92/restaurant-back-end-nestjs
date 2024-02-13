import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SelectedMealDetailModule } from './selected_meal_detail/selected_meal_detail.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { MealModule } from './meal/meal.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, SelectedMealDetailModule, RestaurantModule, OrderModule, MenuModule, MealModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
