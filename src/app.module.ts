import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { CommentsModule } from './comments/comments.module';
import { AzureStorageService } from './azure/azure-storage.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← loads .env for all modules
    PrismaModule,
    UsersModule,
    PhotosModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AzureStorageService],
})
export class AppModule {}
