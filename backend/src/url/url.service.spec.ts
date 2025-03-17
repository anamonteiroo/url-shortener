import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('UrlService', () => {
  let urlService: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      url: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
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

  it('should shorten a URL', async () => {
    const dto = { original: 'https://example.com' };
    const short = 'abc123';

    jest.spyOn(prisma.url, 'create').mockResolvedValue({
      id: '1',
      original: dto.original,
      short,
      userId: null,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await urlService.shortenUrl(dto);

    expect(result).toEqual({
      message: 'URL shortened successfully',
      shortUrl: `http://localhost:3000/${short}`,
    });
    expect(prisma.url.create).toHaveBeenCalledWith({
      data: {
        original: dto.original,
        short: expect.any(String),
        userId: undefined,
      },
    });
  });

  it('should throw an error when shortening URL fails', async () => {
    const dto = { original: 'https://example.com' };

    jest.spyOn(prisma.url, 'create').mockRejectedValue(new Error());

    await expect(urlService.shortenUrl(dto)).rejects.toThrow(BadRequestException);
  });

  it('should get user URLs', async () => {
    const userId = 'user123';
    const mockUrls = [
      {
        id: '1',
        original: 'https://example.com',
        short: 'abc123',
        clicks: 0,
        userId: userId, // Adicionado
        createdAt: new Date(),
        updatedAt: new Date(), // Adicionado
        deletedAt: null, // Adicionado
      },
    ];
  
    jest.spyOn(prisma.url, 'findMany').mockResolvedValue(mockUrls);
  
    const result = await urlService.getUserUrls(userId);
  
    expect(result).toEqual(mockUrls);
    expect(prisma.url.findMany).toHaveBeenCalledWith({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        original: true,
        short: true,
        clicks: true,
        createdAt: true,
      },
    });
  });

  it('should update a URL', async () => {
    const userId = 'user123';
    const urlId = '1';
    const dto = { original: 'https://newexample.com' };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue({
      id: urlId,
      original: 'https://example.com',
      short: 'abc123',
      userId,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      id: urlId,
      original: dto.original,
      short: 'abc123',
      userId,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await urlService.updateUrl(userId, urlId, dto);

    expect(result).toEqual({
      id: urlId,
      original: dto.original,
    });
  });

  it('should throw an error when updating a non-existent URL', async () => {
    const userId = 'user123';
    const urlId = '1';
    const dto = { original: 'https://newexample.com' };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(null);

    await expect(urlService.updateUrl(userId, urlId, dto)).rejects.toThrow('URL not found or unauthorized');
  });

  it('should delete a URL', async () => {
    const userId = 'user123';
    const urlId = '1';

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue({
      id: urlId,
      original: 'https://example.com',
      short: 'abc123',
      userId,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(prisma.url, 'update').mockResolvedValue({
      id: urlId,
      original: 'https://example.com',
      short: 'abc123',
      userId,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    });

    const result = await urlService.deleteUrl(userId, urlId);

    expect(result).toEqual({
      id: urlId,
      deletedAt: expect.any(Date),
    });
  });

  it('should throw an error when deleting a non-existent URL', async () => {
    const userId = 'user123';
    const urlId = '1';

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(null);

    await expect(urlService.deleteUrl(userId, urlId)).rejects.toThrow('URL not found or unauthorized');
  });
});