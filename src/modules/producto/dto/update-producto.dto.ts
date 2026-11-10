
import { PartialType, OmitType } from '@nestjs/swagger'
import { CreateProductoDto } from './create-producto.dto'

export class UpdateProductoDto extends PartialType(
  OmitType(CreateProductoDto, ['stock'] as const),
) {}
