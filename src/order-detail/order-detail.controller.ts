import { Public } from 'src/auth/public.decorator';
import { OrderDetailService } from './order-detail.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Public()
  @Get()
  async findAll() {
    return await this.orderDetailService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderDetailService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order details not found');
    }
    return order;
  }
}
