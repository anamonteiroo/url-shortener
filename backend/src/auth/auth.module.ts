import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; 
import { AuthService } from './auth.service'; 
import { PrismaService } from '../prisma/prisma.service'; 
import { JwtModule } from '@nestjs/jwt'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; 
import { PassportModule } from '@nestjs/passport'; 

@Module({
  imports: [
    ConfigModule.forRoot(), 
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret-key'), 
        signOptions: { expiresIn: '1h' }, 
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService, PrismaService, JwtStrategy], 
  exports: [PassportModule, JwtModule], 
})
export class AuthModule {}