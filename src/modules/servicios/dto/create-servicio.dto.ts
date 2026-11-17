
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialServicioDto } from './material-servicio.dto';

export class CreateServicioDto {
  @ApiProperty({ example: 'Limpieza dental' })
  @IsString()
  @IsNotEmpty()
  nombreServicio!: string;

  @ApiProperty({
    example: 'Limpieza profesional con ultrasonido',
  })
  @IsString()
  @IsNotEmpty()
  descripcionServicio!: string;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @IsNotEmpty()
  precioServicio!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @ApiProperty({
    example: '6655f0c9a1b2c3d4e5f6a7b8',
  })
  @IsMongoId()
  @IsNotEmpty()
  monedaServicio!: string;

  @ApiPropertyOptional({
    type: [MaterialServicioDto],
    example: [
      {
        producto: '6655f0c9a1b2c3d4e5f6a7b8',
        cantidad: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialServicioDto)
  @IsOptional()
  materiales?: MaterialServicioDto[];
}
