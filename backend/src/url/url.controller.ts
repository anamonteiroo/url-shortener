import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('shorten')
  @UseGuards(AuthGuard('jwt')) // Apenas autenticados
  shorten(@Body() dto: UrlDto, @Request() req) {
    return this.urlService.shortenUrl(dto, req.user.id);
  }
}
