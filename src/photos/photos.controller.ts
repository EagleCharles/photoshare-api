import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { AzureStorageService } from '../azure/azure-storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('photos')
@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly azureStorageService: AzureStorageService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; caption?: string },
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.azureStorageService.uploadFile(file);
    return this.photosService.create({
      title: body.title,
      caption: body.caption,
      url,
      creatorId: req.user.userId || req.user.id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    const photoId = Number(id);
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_photoId: { userId, photoId } }
    });
    if (existingLike) {
      return this.prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      return this.prisma.like.create({ data: { userId, photoId } });
    }
  }

  @Get()
  findAll() { return this.photosService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.photosService.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.photosService.remove(+id); }
}