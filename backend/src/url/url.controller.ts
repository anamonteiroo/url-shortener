import { Controller, Post, Get, Param, NotFoundException, Body, UseGuards, Request, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('url/shorten')
  @UseGuards(AuthGuard('jwt')) // Apenas autenticados
  shorten(@Body() dto: UrlDto, @Request() req) {
    return this.urlService.shortenUrl(dto, req.user.id);
  }

  @Get(':shortUrl')
  async redirectToOriginal(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortUrl);

    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }

    return res.redirect(originalUrl);
  }
}

