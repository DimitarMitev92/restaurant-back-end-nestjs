import { Module } from '@nestjs/common';
import { MenuTypeService } from './menu-type.service';
import { MenuTypeController } from './menu-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuType } from './entities/menu-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuType])],
  controllers: [MenuTypeController],
  providers: [MenuTypeService],
  exports: [MenuTypeService],
})
export class MenuTypeModule {}
