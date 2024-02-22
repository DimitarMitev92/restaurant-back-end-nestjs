import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { MealService } from 'src/meal/meal.service';
import { MealModule } from 'src/meal/meal.module';
import { OrderDetailModule } from 'src/order-detail/order-detail.module';
import { Meal } from 'src/meal/entities/meal.entity';
import { CategoryModule } from 'src/category/category.module';
import { Category } from 'src/category/entities/category.entity';
import { Package } from 'src/package/entities/package.entity';
import { PackageModule } from 'src/package/package.module';
import { MenuService } from 'src/menu/menu.service';
import { MenuModule } from 'src/menu/menu.module';
import { Menu } from 'src/menu/entities/menu.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { MenuType } from 'src/menu-type/entities/menu-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      Meal,
      Category,
      Package,
      Menu,
      MenuType,
      Restaurant,
    ]),
    forwardRef(() => OrderDetailModule),
    forwardRef(() => MealModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => PackageModule),
    forwardRef(() => MenuModule),
    forwardRef(() => RestaurantModule),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderDetailService,
    MealService,
    MenuService,
    RestaurantService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
