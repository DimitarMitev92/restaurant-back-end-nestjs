import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackegeDto } from './dto/create-packege.dto';
import { UpdatePackegeDto } from './dto/update-packege.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Packege } from './entities/packege.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackegeService {
  constructor(@InjectRepository(Packege) private repo: Repository<Packege>) {}

  create(createPackegeDto: CreatePackegeDto) {
    return this.repo.create(createPackegeDto);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const packege = this.repo.findOneBy({ id: id });
    if (!packege)
      throw new NotFoundException('Packege with this id does not exist');

    return packege;
  }

  async update(id: string, updatePackegeDto: UpdatePackegeDto) {
    const packege = await this.findOne(id);
    const updatedPackege = { ...packege, ...updatePackegeDto };
    return this.repo.save(updatedPackege);
  }

  remove(id: string) {
    this.repo.softDelete(id);
  }
}
