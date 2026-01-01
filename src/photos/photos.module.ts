import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AzureStorageService } from '../azure/azure-storage.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [PhotosController],
  providers: [
    PhotosService,
    AzureStorageService,
  ],
})
export class PhotosModule {}