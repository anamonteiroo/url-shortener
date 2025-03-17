import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UrlService', () => {
  let urlService: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {

    const prismaMock = {
      url: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaService, useValue: prismaMock }, 
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should retrieve original URL and increment clicks', async () => {
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue({
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 0,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 1,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await urlService.getOriginalUrl('abc123');

    expect(result).toBe('https://example.com');
    expect(prisma.url.update).toHaveBeenCalledWith({
      where: { short: 'abc123' },
      data: { clicks: { increment: 1 } }, 
    });
  });
});