
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class MaterialServicioDto {
  @ApiProperty({
    example: '6655f0c9a1b2c3d4e5f6a7b8',
    description: 'ID del producto utilizado como material',
  })
  @IsMongoId()
  producto!: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad necesaria del producto',
  })
  @IsNumber()
  @Min(0.01)
  cantidad!: number;
}
