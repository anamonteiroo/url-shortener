import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
@Module({
  imports: [PrismaModule],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
