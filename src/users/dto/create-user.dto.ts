import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ description: 'Optional name of the user', required: false, example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Role of the user (must be creator or consumer)', 
    example: 'consumer', 
    default: 'consumer',
    enum: ['creator', 'consumer'] 
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['creator', 'consumer'], { message: 'Role must be either "creator" or "consumer"' })
  role: string;
}