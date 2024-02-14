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
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from 'db/data.source';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { PackegeModule } from './packege/packege.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbdatasource),
    UserModule,
    SelectedMealDetailModule,
    RestaurantModule,
    OrderModule,
    MenuModule,
    MealModule,
    AuthModule,
    LocationModule,
    CategoryModule,
    PackegeModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }, AppService],
})
export class AppModule {}
