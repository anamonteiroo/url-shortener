import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  original: string;
}
