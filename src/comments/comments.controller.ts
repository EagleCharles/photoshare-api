import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  BadRequestException
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    // 1. Robust ID extraction from JWT
    const rawId = req.user?.id || req.user?.sub || req.user?.userId;
    const userId = Number(rawId);
    
    // 2. Immediate validation before hitting the service
    if (!userId || isNaN(userId)) {
      console.error('JWT Payload missing ID. User object:', req.user);
      throw new BadRequestException('Invalid User ID in token');
    }
    
    return this.commentsService.create(userId, createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Get('photo/:photoId')
  findByPhoto(@Param('photoId') photoId: string) {
    return this.commentsService.findByPhoto(+photoId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}