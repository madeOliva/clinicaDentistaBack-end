import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateCategoriaDto {
  @IsString()
  @MinLength(2)
  nombre: string

  @IsOptional()
  @IsString()
  descripcion?: string

  @IsOptional()
  @IsBoolean()
  activa?: boolean
}