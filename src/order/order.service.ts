import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { MealService } from 'src/meal/meal.service';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UpdateOrderDetailDto } from 'src/order-detail/dto/update-order-detail.dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private mealService: MealService,
    private readonly orderDetailService: OrderDetailService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const mealIds = createOrderDetailDto.meals.map(
      (mealDetail) => mealDetail.mealId,
    );
    const areAllMealsFromSameRestaurant =
      await this.mealService.allMealsFromSameRestaurant(
        mealIds,
        createOrderDto.restaurantId,
      );

    if (!areAllMealsFromSameRestaurant) {
      throw new BadRequestException(
        'All meals must come from the specified restaurant.',
      );
    }
    return await this.entityManager.transaction(
      async (transactionEntityManager) => {
        const order = transactionEntityManager.create(Order, {
          clientId: createOrderDto.clientId,
          restaurantId: createOrderDto.restaurantId,
          pickMethod: createOrderDto.pickMethod,
          additionalInfo: createOrderDto.additionalInfo,
        });
        await transactionEntityManager.save(order);

        let finalPrice = 0;

        const orderDetailsPromises = createOrderDetailDto.meals.map(
          async (mealDetail) => {
            const mealPrice = await this.mealService.getMealPriceById(
              mealDetail.mealId,
            );
            const totalPrice = mealPrice * mealDetail.count;
            finalPrice += totalPrice;
            return transactionEntityManager.create(OrderDetail, {
              orderId: order.id,
              mealId: mealDetail.mealId,
              count: mealDetail.count,
              totalPrice: totalPrice,
              additionalNote: mealDetail.additionalNote,
            });
          },
        );

        const orderDetails = await Promise.all(orderDetailsPromises);
        await transactionEntityManager.save(orderDetails);

        finalPrice = parseFloat(finalPrice.toFixed(2));

        const orderResponse = {
          clientId: order.clientId,
          restaurantId: order.restaurantId,
          pickMethod: order.pickMethod,
          additionalInfo: order.additionalInfo,
          id: order.id,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deletedAt: order.deletedAt,
          finalPrice: finalPrice,
          meals: orderDetails.map((detail) => ({
            mealId: detail.mealId,
            count: detail.count,
            totalPrice: detail.totalPrice,
            additionalNote: detail.additionalNote,
          })),
        };

        return orderResponse;
      },
    );
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

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const areAllMealsFromSpecifiedRestaurant =
      await this.mealService.allMealsFromSameRestaurant(
        updateOrderDetailDto.meals.map((mealDetail) => mealDetail.mealId),
        updateOrderDto.restaurantId,
      );

    if (!areAllMealsFromSpecifiedRestaurant) {
      throw new BadRequestException(
        'All meals must come from the specified restaurant in the update.',
      );
    }

    let finalPrice = 0;

    await this.entityManager.transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(Order, {
        ...order,
        ...updateOrderDto,
      });

      await transactionEntityManager.delete(OrderDetail, { orderId: id });

      for (const mealDetail of updateOrderDetailDto.meals) {
        const mealPrice = await this.mealService.getMealPriceById(
          mealDetail.mealId,
        );
        const totalPrice = mealPrice * mealDetail.count;

        finalPrice += totalPrice;

        await transactionEntityManager.save(OrderDetail, {
          orderId: id,
          mealId: mealDetail.mealId,
          count: mealDetail.count,
          totalPrice: totalPrice,
        });
      }
    });

    await this.orderRepository.save({
      id: id,
      finalPrice: finalPrice,
    });

    finalPrice = parseFloat(finalPrice.toFixed(2));
    const updatedOrder = await this.orderRepository.findOneBy({ id });
    const updatedOrderDetails =
      await this.orderDetailService.findOrderDetailsByOrderId(id);

    const response = {
      clientId: updatedOrder.clientId,
      restaurantId: updatedOrder.restaurantId,
      pickMethod: updatedOrder.pickMethod,
      additionalInfo: updatedOrder.additionalInfo,
      id: updatedOrder.id,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      deletedAt: updatedOrder.deletedAt,
      finalPrice: finalPrice,
      meals: updatedOrderDetails.map((detail) => ({
        mealId: detail.mealId,
        count: detail.count,
        totalPrice: detail.totalPrice,
      })),
    };

    return response;
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
