import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UrlService', () => {
  let urlService: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, PrismaService],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should shorten a URL', async () => {
    jest.spyOn(prisma.url, 'create').mockResolvedValue({
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 0,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });
    

    const result = await urlService.shortenUrl({ original: 'https://example.com' });

    expect(result.shortUrl).toContain('/go/');
  });

  it('should retrieve original URL and increment clicks', async () => {
    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 1,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });

    const result = await urlService.getOriginalUrl('abc123');

    expect(result).toBe('https://example.com');
  });
});
