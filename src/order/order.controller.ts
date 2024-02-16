import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Post('/create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return order;
  }

  @Public()
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for order with id:${id}`);
    return this.orderService.removeSoft(id);
  }

  @Public()
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for order with id :${id}`);
    return this.orderService.removePermanent(id);
  }
}
