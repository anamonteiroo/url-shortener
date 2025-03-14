import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UrlDto } from './dto/url.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async shortenUrl(dto: UrlDto, userId?: string) {
    const short = randomBytes(3).toString('hex');

    try {
      const url = await this.prisma.url.create({
        data: {
          original: dto.original,
          short,
          userId,
        },
      });

      return {
        message: 'URL shortened successfully',
        shortUrl: `http://localhost:3000/${url.short}`,
      };
    } catch (error) {
      throw new BadRequestException('Error shortening URL');
    }
  }

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const url = await this.prisma.url.update({
      where: { short: shortUrl },
      data: { clicks: { increment: 1 } },
    });
  
    return url?.original || null;
  }
  
}
