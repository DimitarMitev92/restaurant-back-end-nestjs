import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepo: Repository<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = this.orderRepo.create(createOrderDto);
    return await this.orderRepo.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
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

    return this.orderRepo.save(updatedOrder);
  }

  async removeSoft(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepo.softRemove(order);
    return {
      success: true,
      message: `Soft delete order successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepo.remove(order);
    return {
      success: true,
      message: `Permanent delete order successful with id ${id}`,
    };
  }
}
