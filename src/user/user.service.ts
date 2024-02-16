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
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { deletedAt: null } });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email: email, deletedAt: null },
    });
  }

  async create(data: DeepPartial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
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

    Object.assign(existingUser, data);

    return await this.userRepository.save(existingUser);
  }
}
