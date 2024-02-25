import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateOrderDetailDto,
  MealDetailDto,
} from './dto/create-order-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { Meal } from 'src/meal/entities/meal.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Order } from 'src/order/entities/order.entity';
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

  async getMostOrderedMeal() {
    const query = await this.orderDetailRepository
      .createQueryBuilder('od')
      .select('meal.id', 'meal_id')
      .addSelect('meal.name', 'meal_name')
      .addSelect('restaurant.name', 'restaurant_name')
      .addSelect('COUNT(od.meal_id)', 'order_count')
      .innerJoin(Meal, 'meal', '"meal"."id" = "od"."meal_id"')
      .innerJoin(Menu, 'menu', '"menu"."id" = "meal"."menu_id"')
      .innerJoin(
        Restaurant,
        'restaurant',
        '"restaurant"."id" = "menu"."restaurant_id"',
      )
      .groupBy('meal.id, meal.name, restaurant.name')
      .orderBy('order_count', 'DESC')
      .limit(1);

    return query;
  }

  async getClientBill(clientId: string) {
    const query = await this.orderDetailRepository
      .createQueryBuilder('od')
      .select([
        'od.id AS order_detail_id',
        'od.meal_id',
        'meal.name AS meal_name',
        'meal.description AS meal_description',
        'od.count',
        'meal.price AS meal_price',
        'od.total_price AS order_total_price',
        'o.id AS order_id',
        'o.createdAt AS order_date_issued',
        'o.pick_method',
        'o.additional_info',
      ])
      .innerJoin(Meal, 'meal', '"meal"."id" = "od"."meal_id"')
      .innerJoin(Menu, 'mn', '"mn"."id" = "meal"."menu_id"')
      .innerJoin(Restaurant, 'r', '"r"."id" = "mn"."restaurant_id"')
      .innerJoin(Order, 'o', '"od"."order_id" = "o"."id"')
      .where('o.client_id = :clientId', { clientId })
      .getRawMany();

    return query;
  }
}
