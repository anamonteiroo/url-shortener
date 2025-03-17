import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

JwtModule.register({
  secret: process.env.JWT_SECRET || 'defaultSecret',
  signOptions: { expiresIn: '1h' },
});