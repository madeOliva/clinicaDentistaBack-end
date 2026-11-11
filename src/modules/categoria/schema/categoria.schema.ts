import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CategoriaDocument = HydratedDocument<Categoria>

@Schema({ timestamps: true })
export class Categoria {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  nombre: string

  @Prop({
    default: '',
    trim: true,
  })
  descripcion: string

  @Prop({
    default: true,
  })
  activa: boolean
}

export const CategoriaSchema =
  SchemaFactory.createForClass(Categoria)