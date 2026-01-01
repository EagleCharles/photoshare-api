import { Module, forwardRef } from '@nestjs/common'; // ✅ Add forwardRef
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
// ... other imports like Prisma

@Module({
  imports: [
    forwardRef(() => AuthModule), // ✅ Wrap this in forwardRef
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}