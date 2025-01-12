import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @Inject('MESSAGE_QUEUE') private readonly messageQueue: ClientProxy,
  ) {}

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    const { email, name } = userData;
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email Already Exist');
    }
    const user = this.userRepository.create(userData);
    this.messageQueue.emit('user_created', { email, name });
    return this.userRepository.save(user);
  }

  async getAllUsers(
    query: QueryParamsDto,
  ): Promise<{ data: Users[]; total: number; limit: number; offset: number }> {
    const { where, limit = 10, offset = '0', order = 'ASC' } = query;
    const whereClause = where || {};
    const [data, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: parseInt(offset),
      order: {
        name: order,
      },
      where: whereClause,
    });

    return {
      data,
      total,
      limit,
      offset: parseInt(offset),
    };
  }

  async findGreaterAgeUsers(age: number): Promise<Users[]> {
    const data = await this.userRepository.find({
      where: { age: MoreThan(age) },
      order: {
        name: 'ASC',
      },
    });

    return data;
  }

  async getUserById(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const payload = { ...user, ...body };

    return this.userRepository.save(payload);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);

    return { message: `User with ID ${id} deleted successfully` };
  }
}
