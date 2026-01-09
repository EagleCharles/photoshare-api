import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(private prisma: PrismaService) {}

  async create(createPhotoDto: any) { // Changed to any to accept location/people
    return this.prisma.photo.create({
      data: {
        title: createPhotoDto.title,
        caption: createPhotoDto.caption,
        location: createPhotoDto.location, // Added this
        people: createPhotoDto.people,     // Added this
        url: createPhotoDto.url,
        creatorId: Number(createPhotoDto.creatorId),
      },
      include: { 
        creator: { select: { name: true } }, 
        likes: true, 
        comments: { include: { user: { select: { name: true } } } } 
      },
    });
  }

  async findAll() {
    return this.prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        likes: true,
        comments: {
          include: { 
            user: { select: { id: true, name: true } } 
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });
  }

  async findOne(id: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: Number(id) },
      include: {
        creator: { select: { name: true } },
        likes: true,
        comments: { include: { user: { select: { name: true } } } },
      },
    });
    if (!photo) throw new NotFoundException(`Photo #${id} not found`);
    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return this.prisma.photo.update({
      where: { id: Number(id) },
      data: updatePhotoDto,
      include: { 
        creator: { select: { name: true } }, 
        likes: true, 
        comments: true 
      },
    });
  }

  async remove(id: number) {
    return this.prisma.photo.delete({ 
      where: { id: Number(id) } 
    });
  }
}