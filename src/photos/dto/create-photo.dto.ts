import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ description: 'Title of the photo' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Optional caption for the photo', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'URL of the photo' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'ID of the user who created the photo' })
  @IsInt()
  creatorId: number;
}
