
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { TipoMovimiento } from '../schema/movimientos.schema'


export class CreateMovimientoDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del producto',
  })
  @IsMongoId()
  producto!: string

  @ApiProperty({
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA,
    description: 'Tipo de movimiento',
  })
  @IsEnum(TipoMovimiento)
  tipo!: TipoMovimiento

  @ApiProperty({
    example: 10,
    description: 'Cantidad de unidades',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad!: number

  @ApiPropertyOptional({
    example: 'Compra de mercancía',
    description: 'Motivo del movimiento',
  })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  motivo?: string
}
