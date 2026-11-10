
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProductoDto {
  @ApiProperty({ example: 'PROD-001' })
  @IsString()
  @IsNotEmpty()
  codigo!: string

  @ApiProperty({ example: 'Guantes de látex' })
  @IsString()
  @IsNotEmpty()
  nombre!: string

  @ApiPropertyOptional({ example: 'Guantes para procedimientos' })
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiProperty({ example: 'Higiene' })
  @IsString()
  @IsNotEmpty()
  categoria!: string

  @ApiProperty({ example: 'Caja' })
  @IsString()
  @IsNotEmpty()
  unidadMedida!: string

  @ApiProperty({ example: 10.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioCompra!: number

  @ApiProperty({ example: 15.75 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioVenta!: number

  @ApiPropertyOptional({ example: 20, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockMinimo!: number

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean
}
