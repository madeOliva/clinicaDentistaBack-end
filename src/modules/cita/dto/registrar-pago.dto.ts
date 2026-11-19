import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class RegistrarPagoDto {
  @ApiProperty({
    example: 1500,
    description: 'Importe realmente cobrado por el servicio',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioCobrado!: number
}