
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  ArrayUnique,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Modulo } from '../enums/modulo.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'usuario02' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre?: string;

  @ApiPropertyOptional({ example: '+51 999 888 777' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\s-]+$/, {
    message: 'El teléfono solo debe contener números',
  })
  telefono?: string;

  @ApiPropertyOptional({
    example: 'NuevaClaveSegura123',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({
    enum: Modulo,
    isArray: true,
    example: [Modulo.DASHBOARD, Modulo.SERVICIOS],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Modulo, { each: true })
  permisos?: Modulo[];
}
