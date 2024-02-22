import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { MenuTypeModule } from 'src/menu-type/menu-type.module';
import { MenuType } from 'src/menu-type/entities/menu-type.entity';

@Module({
  imports: [
    RestaurantModule,
    TypeOrmModule.forFeature([Menu, MenuType]),
    MenuTypeModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
