import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateOrderDetailDto,
  MealDetailDto,
} from './dto/create-order-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto, orderId: string) {
    const orderDetails = createOrderDetailDto.meals.map(
      (mealDetail: MealDetailDto) => {
        return this.orderDetailRepository.create({
          orderId: orderId,
          mealId: mealDetail.mealId,
          count: mealDetail.count,
        });
      },
    );

    return await this.orderDetailRepository.save(orderDetails);
  }

  async findOne(id: string): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id },
    });
    if (!orderDetail) {
      throw new NotFoundException(`Order details for ID ${id} not found`);
    }
    return orderDetail;
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailRepository.find();
  }

  async findAllByOrderId(orderId: string): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({
      where: { orderId },
    });
  }

  async update(
    id: string,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const orderDetail = await this.findOne(id);
    if (!orderDetail) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    const updatedOrderDetail = { ...orderDetail, ...updateOrderDetailDto };

    return this.orderDetailRepository.save(updatedOrderDetail);
  }

  async removeSoft(id: string) {
    const orderDetail = await this.findOne(id);
    if (!orderDetail) {
      throw new NotFoundException(`Order detail with id:${id} does not exist`);
    }
    await this.orderDetailRepository.softDelete(id);
    return {
      success: true,
      message: `Soft delete order detail successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const orderDetail = await this.findOne(id);
    if (!orderDetail) {
      throw new NotFoundException(`Order details with ID ${id} not found!`);
    }
    await this.orderDetailRepository.delete(id);
    return {
      success: true,
      message: `Permanent delete order details successful with id ${id}`,
    };
  }

  async findOrderDetailsByOrderId(orderId: string): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({
      where: { orderId: orderId },
    });
  }
}
