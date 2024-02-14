import { Module } from '@nestjs/common';
import { PackegeService } from './packege.service';
import { PackegeController } from './packege.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packege } from './entities/packege.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Packege])],
  controllers: [PackegeController],
  providers: [PackegeService],
})
export class PackegeModule {}
