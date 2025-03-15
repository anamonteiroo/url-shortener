import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ message: 'User registered successfully' }),
            login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const result = await authController.register({ email: 'test@example.com', password: 'password' });
    expect(result).toEqual({ message: 'User registered successfully' });
  });

  it('should login a user', async () => {
    const result = await authController.login({ email: 'test@example.com', password: 'password' });
    expect(result).toEqual({ access_token: 'jwt_token' });
  });
});
