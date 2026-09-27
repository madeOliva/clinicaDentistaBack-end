import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'José Pérez' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: '+51 999 888 777' })
  @IsString()
  @Matches(/^[0-9+\s-]+$/, { message: 'El teléfono solo debe contener números' })
  telefono: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}