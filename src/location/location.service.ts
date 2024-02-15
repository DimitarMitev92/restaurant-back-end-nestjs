import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private locationRepo: Repository<Location>,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const existingLocation = await this.locationRepo.findOne({
      where: { name: createLocationDto.name },
    });

    if (existingLocation) {
      throw new BadRequestException('Location with this name already exists');
    }

    const newLocation = this.locationRepo.create(createLocationDto);
    return this.locationRepo.save(newLocation);
  }

  async findAll(name: string) {
    return this.locationRepo.find({ where: { name } });
  }
  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepo.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    const updatedLocation = { ...location, ...updateLocationDto };

    return this.locationRepo.save(updatedLocation);
  }

  async removeSoft(id: string) {
    const location = await this.findOne(id);

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    await this.locationRepo.softRemove(location);
    return {
      success: true,
      message: `Soft delete location successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const location = await this.findOne(id);

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    await this.locationRepo.remove(location);
    return {
      success: true,
      message: `Permanent delete location successful with id ${id}`,
    };
  }
}
