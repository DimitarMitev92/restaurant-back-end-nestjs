import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly repo: Repository<OrderDetail>,
  ) {}

  create(createOrderDetailDto: CreateOrderDetailDto) {
    const orderDetail = this.repo.create(createOrderDetailDto);
    return this.repo.save(orderDetail);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id: id });
  }

  async remove(id: string) {
    const orderDetail = await this.findOne(id);
    if (!orderDetail)
      throw new NotFoundException(`Order detail with id:${id} does not exist`);
    return this.repo.softDelete(id);
  }
}
