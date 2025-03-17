import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const jwtServiceMock = {
  sign: jest.fn(() => 'mockedToken'), // Retorna sempre um token fixo
};

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        { provide: JwtService, useValue: jwtServiceMock }, // Mock do JwtService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should register a user', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      createdAt: new Date(),
    });

    const result = await authService.register({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result.user.email).toBe('test@example.com');
  });

  it('should fail to register if email is already in use', async () => {
    jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error());

    await expect(
      authService.register({ email: 'test@example.com', password: 'password' }),
    ).rejects.toThrow();
  });

  it('should validate login with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
    });

    const result = await authService.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toHaveProperty('access_token');
  });

  it('should reject login with wrong credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      authService.login({ email: 'wrong@example.com', password: 'password' }),
    ).rejects.toThrow();
  });
});
