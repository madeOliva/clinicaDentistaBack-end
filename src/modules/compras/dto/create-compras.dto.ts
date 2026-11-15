
import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCompraDto {
  @ApiProperty({
    example: '66f123456789abcdef123456',
    description: 'ID del producto comprado',
  })
  @IsMongoId()
  @IsNotEmpty()
  productoId!: string

  @ApiProperty({
    example: 10,
    description: 'Cantidad comprada',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad!: number

  @ApiProperty({
    example: 15.5,
    description: 'Precio unitario de compra',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioUnitario!: number

  @ApiProperty({
    example: '66f123456789abcdef123457',
    description: 'ID de la moneda utilizada',
  })
  @IsMongoId()
  @IsNotEmpty()
  monedaId!: string

  @ApiPropertyOptional({
    example: 'Proveedor Dental S.A.',
  })
  @IsString()
  @IsOptional()
  proveedor?: string

  @ApiPropertyOptional({
    example: '2026-11-15T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  fechaCompra?: string

  @ApiPropertyOptional({
    example: 'Compra mensual de materiales',
  })
  @IsString()
  @IsOptional()
  observaciones?: string
}
