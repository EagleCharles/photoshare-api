import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  // ✅ ADDED: Password field to match your Prisma schema
  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'Optional name of the user', required: false })
  name?: string;

  @ApiProperty({ description: 'Role of the user', example: 'consumer', default: 'consumer' })
  role: string; // "creator" or "consumer"
}