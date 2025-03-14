import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UrlDto } from './dto/url.dto';
import { randomBytes } from 'crypto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) { }

  async shortenUrl(dto: UrlDto, userId?: string) {
    const short = randomBytes(3).toString('hex');

    try {
      const url = await this.prisma.url.create({
        data: {
          original: dto.original,
          short,
          userId
        }
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

  async getUserUrls(userId: string) {
    return this.prisma.url.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        original: true,
        short: true,
        clicks: true,
        createdAt: true,
      },
    });
  }

  async updateUrl(userId: string, urlId: string, dto: UpdateUrlDto) {
    const url = await this.prisma.url.findUnique({ where: { id: urlId } });

    if (!url || url.userId !== userId || url.deletedAt !== null) {
      throw new Error('URL not found or unauthorized');
    }

    try {
      await this.prisma.url.update({
        where: { id: urlId },
        data: { original: dto.original },
      });

      return {
        id: urlId,
        original: dto.original,
      };
    } catch (error) {
      throw new BadRequestException('Error updating URL');
    }
  }

  async deleteUrl(userId: string, urlId: string) {
    const url = await this.prisma.url.findUnique({ where: { id: urlId } });

    if (!url || url.userId !== userId || url.deletedAt !== null) {
      throw new Error('URL not found or unauthorized');
    }

    try {
      const deletedAt = new Date()

      await this.prisma.url.update({
        where: { id: urlId },
        data: { deletedAt: deletedAt },
      });

      return {
        id: urlId,
        deletedAt: deletedAt,
      };
    } catch (error) {
      throw new BadRequestException('Error deleting URL');
    }
  }
}
