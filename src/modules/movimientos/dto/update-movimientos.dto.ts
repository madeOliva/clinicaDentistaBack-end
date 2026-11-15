
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateMovimientoDto {
  @ApiPropertyOptional({
    example: 'Corrección del motivo',
    description: 'Motivo actualizado del movimiento',
  })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  motivo?: string
}
