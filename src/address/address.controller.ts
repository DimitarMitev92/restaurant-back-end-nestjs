import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRights } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@UseGuards(RolesGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Post('create')
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.addressService.findAllAddressesByUserId(userId);
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Roles([UserRights.ADMIN, UserRights.CLIENT])
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.removePermanent(id);
  }
}
