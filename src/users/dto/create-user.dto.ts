import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'User Name' })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User Email' })
  email: string;

  @IsNumber()
  @Min(0)
  @Max(120)
  @ApiProperty({ description: 'User Age' })
  age: number;
}
