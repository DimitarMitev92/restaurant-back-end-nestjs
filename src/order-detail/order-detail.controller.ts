import { OrderDetailService } from './order-detail.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';
import { Public } from 'src/auth/public.decorator';

@Controller('order-detail')
@UseGuards(RolesGuard)
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Public()
  @Get('most-ordered')
  async findMostOrderedMeal() {
    try {
      const mostOrderedMeal =
        await this.orderDetailService.getMostOrderedMeal();
      return { mostOrderedMeal };
    } catch (error) {
      console.error('Error fetching most ordered meal:', error);
      throw new NotFoundException(
        'An error occurred while fetching the most ordered meal',
      );
    }
  }

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
