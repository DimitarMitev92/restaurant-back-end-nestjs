import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { MealService } from 'src/meal/meal.service';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private orderDetailService: OrderDetailService,
    private mealService: MealService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const newOrder = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(newOrder);

    const meal = await this.mealService.findOne(createOrderDetailDto.mealId);
    if (!meal) {
      throw new Error('Meal not found');
    }

    const orderDetail = new OrderDetail();
    orderDetail.orderId = savedOrder.id;
    orderDetail.mealId = createOrderDetailDto.mealId;
    orderDetail.count = createOrderDetailDto.count;
    orderDetail.totalPrice = createOrderDetailDto.totalPrice;

    const savedOrderDetail = await this.orderDetailService.create(orderDetail);

    return { order: savedOrder, orderDetail: savedOrderDetail };
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    const updatedOrder = { ...order, ...updateOrderDto };

    return this.orderRepository.save(updatedOrder);
  }

  async removeSoft(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    await this.orderRepository.softDelete(orderId);

    const orderDetails =
      await this.orderDetailService.findAllByOrderId(orderId);
    const softDeletePromises = orderDetails.map((orderDetail) =>
      this.orderDetailService.removeSoft(orderDetail.id),
    );
    await Promise.all(softDeletePromises);
    return {
      success: true,
      message: `Soft delete order successful with id ${orderId}`,
    };
  }

  async removePermanent(orderId: string) {
    const orderDetails =
      await this.orderDetailService.findAllByOrderId(orderId);
    const deleteOrderDetailsPromises = orderDetails.map((orderDetail) =>
      this.orderDetailService.removePermanent(orderDetail.id),
    );

    await Promise.all(deleteOrderDetailsPromises);

    const result = await this.orderRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return {
      success: true,
      message: `Permanent delete order successful with id ${orderId}`,
    };
  }
}
