import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(user: Partial<User>) {
    await this.userRepository.insert(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async findOneById(id: number) {
    return this.userRepository.findOne({ id });
  }

  async update(id: number, payload: Partial<User>) {
    await this.userRepository.update(id, payload);
  }
}
