import { Public } from 'src/auth/public.decorator';
import { OrderDetailService } from './order-detail.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';

@UseGuards(RolesGuard)
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get()
  async findAll() {
    return await this.orderDetailService.findAll();
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderDetailService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order details not found');
    }
    return order;
  }
}
