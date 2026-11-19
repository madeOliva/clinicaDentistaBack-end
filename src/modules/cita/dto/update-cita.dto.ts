
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator'

import { CreateCitaDto } from './create-cita.dto'
import { EstadoAtencion, EstadoPago } from '../schema/cita.schema'

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @ApiPropertyOptional({ enum: EstadoAtencion })
  @IsOptional()
  @IsEnum(EstadoAtencion)
  estadoAtencion?: EstadoAtencion

  @ApiPropertyOptional({ enum: EstadoPago })
  @IsOptional()
  @IsEnum(EstadoPago)
  estadoPago?: EstadoPago

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioCobrado?: number

  @ApiPropertyOptional({ example: '6655f0c9a1b2c3d4e5f6a7b8' })
  @IsOptional()
  @IsMongoId()
  monedaCobro?: string

  @ApiPropertyOptional({ example: '2026-11-18T15:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fechaRealizacion?: string
}
