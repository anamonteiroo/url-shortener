import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url/url.controller';
import { UrlService } from './url/url.service';
import { UpdateUrlDto } from './url/dto/update-url.dto';
import { CreateUrlDto } from './create.url.create.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            shortenUrl: jest.fn(),
            getUserUrls: jest.fn(),
            updateUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should update a URL', async () => {
    const dto: UpdateUrlDto = { original: 'https://new-url.com' };
    const updatedUrl = { id: '1', original: 'https://new-url.com' }; 
    jest.spyOn(urlService, 'updateUrl').mockResolvedValue(updatedUrl);

    const result = await urlController.updateUrl('1', dto, { user: { id: 'user1' } });
    expect(result).toEqual(updatedUrl);
  });

  it('should throw an error when updating a non-existent URL', async () => {
    const userId = 'user1';
    const urlId = '1';
    const dto: UpdateUrlDto = { original: 'https://new-url.com' };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(null);
    
    jest.spyOn(urlService, 'updateUrl').mockRejectedValue(new Error('URL not found'));

    await expect(urlService.updateUrl(userId, urlId, dto)).rejects.toThrow('URL not found');
  });

  it('should delete a URL', async () => {
    const deletedUrl = { id: '1', deletedAt: new Date() };
    jest.spyOn(urlService, 'deleteUrl').mockResolvedValue(deletedUrl);

    const result = await urlController.deleteUrl('1', { user: { id: 'user1' } });
    expect(result).toEqual(deletedUrl);
  });

  it('should throw an error when deleting a non-existent URL', async () => {
    const userId = 'user1';
    const urlId = '1';

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValue(null);

    jest.spyOn(urlService, 'deleteUrl').mockRejectedValue(new Error('URL not found'));

    await expect(urlService.deleteUrl(userId, urlId)).rejects.toThrow('URL not found');
  });

});
