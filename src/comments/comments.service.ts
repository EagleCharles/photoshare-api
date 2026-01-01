import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    try {
      return await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          // Explicit mapping to your schema fields
          userId: userId,
          photoId: Number(createCommentDto.photoId),
        },
        include: {
          user: { select: { name: true } }
        }
      });
    } catch (error) {
      console.error('--- PRISMA ERROR DETAILS ---');
      console.error(error);
      throw new InternalServerErrorException('Database error while creating comment');
    }
  }

  findAll() {
    return this.prisma.comment.findMany({
      include: { 
        user: { select: { name: true } }, 
        photo: true 
      },
    });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id: Number(id) },
      include: { 
        user: { select: { name: true } }, 
        photo: true 
      },
    });
  }

  findByPhoto(photoId: number) {
    return this.prisma.comment.findMany({
      where: { photoId: Number(photoId) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'asc' }
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id: Number(id) },
      data: { content: updateCommentDto.content },
      include: { user: { select: { name: true } } }
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({ 
      where: { id: Number(id) } 
    });
  }
}