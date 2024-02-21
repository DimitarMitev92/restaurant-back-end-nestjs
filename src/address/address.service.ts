import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    const existingAddress = await this.addressRepo.findOne({
      where: {
        address: createAddressDto.address,
        userId: createAddressDto.userId,
      },
    });

    if (existingAddress) {
      throw new BadRequestException('Address already exist.');
    }

    const newAddress = this.addressRepo.create(createAddressDto);
    return this.addressRepo.save(newAddress);
  }

  findAll() {
    return this.addressRepo.find();
  }

  async findOne(id: string) {
    const address = await this.addressRepo.findOneBy({ id });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
    return address;
  }

  async findOneByUserId(userId: string) {
    const address = await this.addressRepo.findOneBy({ userId: userId });
    if (!address) {
      throw new NotFoundException(`User don't have an address.`);
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);

      const updatedAdress = { ...address, updateAddressDto };

      return this.addressRepo.save(updatedAdress);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  async removeSoft(id: string) {
    const address = await this.findOne(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.addressRepo.softRemove(address);
    return {
      success: true,
      message: `Soft delete address successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const address = await this.findOne(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.addressRepo.remove(address);

    return {
      success: true,
      message: `Permanent delete address successful with id ${id}`,
    };
  }
}
