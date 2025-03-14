import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async register(dto: AuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hashedPassword },
      });
  
      const { password, ...userWithoutPassword } = user;
  
      return { message: 'User registered successfully', user: userWithoutPassword };
    } catch (error) {
      throw new BadRequestException('Email already in use');
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { access_token: token };
  }
}
