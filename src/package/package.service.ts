import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package) private packageRepo: Repository<Package>,
  ) {}
  async create(createPackageDto: CreatePackageDto) {
    const existingPackage = await this.packageRepo.findOne({
      where: { type: createPackageDto.type },
    });

    if (existingPackage) {
      throw new BadRequestException('Package with this type already exists');
    }

    const newPackage = this.packageRepo.create(createPackageDto);
    return this.packageRepo.save(newPackage);
  }

  async findAll(type: string): Promise<Package[]> {
    return this.packageRepo.find({ where: { type } });
  }

  async findOne(id: string): Promise<Package> {
    const pack = await this.packageRepo.findOneBy({ id });
    if (!pack) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return pack;
  }

  async update(
    id: string,
    UpdatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const pack = await this.findOne(id);

    if (!pack) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    const updatedPackage = { ...pack, ...UpdatePackageDto };

    return this.packageRepo.save(updatedPackage);
  }

  async removeSoft(id: string) {
    const pack = await this.findOne(id);

    if (!pack) {
      throw new NotFoundException('Pack not found');
    }

    await this.packageRepo.softRemove(pack);
    return {
      success: true,
      message: `Soft delete package successful with id ${id}`,
    };
  }

  async removePermanent(id: string) {
    const pack = await this.findOne(id);

    if (!pack) {
      throw new NotFoundException('Package not found');
    }

    await this.packageRepo.remove(pack);
    return {
      success: true,
      message: `Permanent delete package successful with id ${id}`,
    };
  }

  async getPackagePriceById(packageId: string) {
    const packageEntity = await this.findOne(packageId);
    return packageEntity.price;
  }
}
