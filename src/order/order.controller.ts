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
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from 'src/order-detail/dto/update-order-detail.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';

@UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Post('/create')
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    return await this.orderService.create(createOrderDto, createOrderDetailDto);
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get('/client/:clientId')
  async findAllOrdersByClientId(@Param('clientId') clientId: string) {
    const orders = await this.orderService.findAllOrdersByClientId(clientId);
    return orders;
  }

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderService.update(id, updateOrderDto, updateOrderDetailDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for order with id:${id}`);
    return this.orderService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for order with id :${id}`);
    return this.orderService.removePermanent(id);
  }
}
