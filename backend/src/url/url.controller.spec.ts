import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            shortenUrl: jest.fn().mockResolvedValue({ shortUrl: 'http://localhost:3000/abc123' }),
            getUserUrls: jest.fn().mockResolvedValue([]),
            updateUrl: jest.fn().mockResolvedValue({ original: 'https://new-url.com' }),
            deleteUrl: jest.fn().mockResolvedValue({ deletedAt: new Date() }),
          },
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should shorten a URL', async () => {
    const dto: UrlDto = { original: 'https://example.com' };
    const result = await urlController.shorten(dto, { user: { id: 'user1' } });
    expect(result).toEqual({ shortUrl: 'http://localhost:3000/abc123' });
  });

  it('should list user URLs', async () => {
    const result = await urlController.getUserUrls({ user: { id: 'user1' } });
    expect(result).toEqual([]);
  });

  it('should update a URL', async () => {
    const dto: UpdateUrlDto = { original: 'https://new-url.com' };
    const result = await urlController.updateUrl({ user: { id: 'user1' } }, '1', dto);
    expect(result).toEqual({ original: 'https://new-url.com' });
  });

  it('should soft delete a URL', async () => {
    const result = await urlController.deleteUrl({ user: { id: 'user1' } }, '1');
    expect(result.deletedAt).toBeInstanceOf(Date);
  });
});
