
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'
import { TipoMovimiento } from '../schema/movimientos.schema'


export class ConsultarMovimientosDto {
  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'Filtrar por ID del producto',
  })
  @IsMongoId()
  @IsOptional()
  producto?: string

  @ApiPropertyOptional({
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA,
    description: 'Filtrar por tipo de movimiento',
  })
  @IsEnum(TipoMovimiento)
  @IsOptional()
  tipo?: TipoMovimiento

  @ApiPropertyOptional({
    example: '2026-11-01',
    description: 'Fecha inicial del filtro',
  })
  @IsDateString()
  @IsOptional()
  fechaDesde?: string

  @ApiPropertyOptional({
    example: '2026-11-15',
    description: 'Fecha final del filtro',
  })
  @IsDateString()
  @IsOptional()
  fechaHasta?: string
}
