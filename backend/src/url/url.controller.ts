import { Controller, Post, Get, Patch, Param, NotFoundException, Body, UseGuards, Request, Res, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('url/shorten')
  @UseGuards(OptionalAuthGuard)
  async shorten(@Body() dto: UrlDto, @Request() req) {
    const userId = req.user?.id || null; 
    return this.urlService.shortenUrl(dto, userId);
  }

  @Get(':shortUrl')
  async redirectToOriginal(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortUrl);

    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }

    return res.redirect(originalUrl);
  }

  @Get('url/my-urls')
  @UseGuards(AuthGuard('jwt'))
  getUserUrls(@Request() req) {
    return this.urlService.getUserUrls(req.user.id);
  }

  @Patch('url/update/:id')
  @UseGuards(AuthGuard('jwt'))
  updateUrl(@Request() req, @Param('id') urlId: string, @Body() dto: UpdateUrlDto) {
    return this.urlService.updateUrl(req.user.id, urlId, dto);
  }

  @Delete('url/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteUrl(@Request() req, @Param('id') urlId: string) {
    return this.urlService.deleteUrl(req.user.id, urlId);
  }
}

