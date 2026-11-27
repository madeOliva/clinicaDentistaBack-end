import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Modulo } from '../enums/modulo.enum';

export class RegisterDto {
  @ApiProperty({ example: 'usuario01' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: '+51 999 888 777' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\s-]+$/, {
    message: 'El teléfono solo debe contener números',
  })
  telefono: string;

  @ApiProperty({ example: 'UnaClaveSegura123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    enum: Modulo,
    isArray: true,
    example: [Modulo.DASHBOARD, Modulo.CLIENTES, Modulo.CITAS],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Modulo, { each: true })
  permisos?: Modulo[];
}