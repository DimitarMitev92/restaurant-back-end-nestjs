import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Public()
  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailService.remove(id);
  }
}
