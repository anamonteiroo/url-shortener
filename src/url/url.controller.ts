import { Controller, Post, Get, Patch, Param, NotFoundException, Body, UseGuards, Req, Res, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller()
export class UrlController {
  getUserUrls(arg0: { user: { id: string; }; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private urlService: UrlService) { }

  @Post('url/shorten')
  @UseGuards(OptionalAuthGuard)
  async shorten(@Body() dto: UrlDto, @Req() req) {
    const userId = req.user?.sub || req.user?.id || null; 
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
async getMyUrls(@Req() req: Request) {
    const userId = req.user?.id || req.user?.sub; 
    return this.urlService.getUserUrls(userId);
}


@Patch('url/update/:id')
@UseGuards(AuthGuard('jwt'))
async updateUrl(@Param('id') id: string, @Body() data: UpdateUrlDto, @Req() req: any) {
    return this.urlService.updateUrl(req.user.id, id, data);
}

@Delete('url/delete/:id')
@UseGuards(AuthGuard('jwt'))
async deleteUrl(@Param('id') id: string, @Req() req) {
    return this.urlService.deleteUrl(req.user.id, id);
}

}
