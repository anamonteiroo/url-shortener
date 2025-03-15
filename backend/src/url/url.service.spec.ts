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

    expect(result.shortUrl).toContain("http://localhost:3000/abc123");
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

describe('UrlService - Redirect & Click Tracking', () => {
  let urlService: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, PrismaService],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should retrieve original URL and increment clicks', async () => {
    const mockUrl = {
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 0,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      ...mockUrl,
      clicks: mockUrl.clicks + 1,
    });

    const result = await urlService.getOriginalUrl('abc123');

    expect(result).toBe('https://example.com');
  });

  it('should return null for non-existent URL', async () => {
    jest.spyOn(prisma.url, 'update').mockRejectedValue(null);

    const result = await urlService.getOriginalUrl('nonexistent');

    expect(result).toBeNull();
  });
});

describe('UrlService - CRUD Operations', () => {
  let urlService: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, PrismaService],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should list user URLs excluding deleted ones', async () => {
    const mockUrls = [
      {
        id: '1',
        original: 'https://example.com',
        short: 'abc123',
        clicks: 5,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    jest.spyOn(prisma.url, 'findMany').mockResolvedValue(mockUrls);

    const result = await urlService.getUserUrls('user1');

    expect(result).toHaveLength(1);
    expect(result[0].short).toBe('abc123');
  });

  it('should update the original URL', async () => {
    const mockUrl = {
      id: '1',
      original: 'https://old-url.com',
      short: 'abc123',
      clicks: 0,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(mockUrl);
    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      ...mockUrl,
      original: 'https://new-url.com',
    });

    const result = await urlService.updateUrl('user1', '1', { original: 'https://new-url.com' });

    expect(result.original).toBe('https://new-url.com');
  });

  it('should soft delete a URL', async () => {
    const mockUrl = {
      id: '1',
      original: 'https://example.com',
      short: 'abc123',
      clicks: 0,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(mockUrl);
    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      ...mockUrl,
      deletedAt: new Date(),
    });

    const result = await urlService.deleteUrl('user1', '1');

    expect(result.deletedAt).not.toBeNull();
  });
});
