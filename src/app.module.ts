import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
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
import { OrderDetailModule } from './order-detail/order-detail.module';
import { PackageModule } from './package/package.module';
import { AwsController } from './aws/aws.controller';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbdatasource),
    UserModule,
    RestaurantModule,
    OrderModule,
    MenuModule,
    MealModule,
    AuthModule,
    LocationModule,
    CategoryModule,
    OrderDetailModule,
    PackageModule,
    AwsModule,
  ],
  controllers: [AppController, AwsController],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }, AppService],
})
export class AppModule {}
