import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') 
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
  }

async create(registerDto: RegisterDto): Promise<User> {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  try {
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role || 'admin',
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;
    return result as User;

  } catch (error) {
    if ((error as any).code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Email already exists');
    }
    throw error;
  }
}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async update(id: number, data: Partial<User>) {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
