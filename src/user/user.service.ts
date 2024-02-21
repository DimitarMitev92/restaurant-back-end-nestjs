import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne({
      where: { id, deletedAt: null },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: { email: email, deletedAt: null },
    });
  }

  async create(data: DeepPartial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async update(id: string, data: DeepPartial<User>): Promise<User> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const userWithSameEmail = await this.findOneByEmail(data.email);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new BadRequestException(
          'Email is already in use by another user.',
        );
      }
    }

    const updatedUser = { ...existingUser, ...data };

    return await this.userRepo.save(updatedUser);
  }
}
