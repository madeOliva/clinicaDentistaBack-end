
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProductosDocument = HydratedDocument<Productos>

@Schema({ timestamps: true })
export class Productos {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  codigo!: string

  @Prop({ required: true, trim: true })
  nombre!: string

  @Prop({ default: '', trim: true })
  descripcion!: string

  @Prop({ required: true, trim: true })
  categoria!: string

  @Prop({ required: true, trim: true })
  unidadMedida!: string

  @Prop({ required: true, min: 0 })
  precioCompra!: number

  @Prop({ required: true, min: 0 })
  precioVenta!: number

  @Prop({ required: true, default: 0, min: 0 })
  stock!: number

  @Prop({ required: true, default: 0, min: 0 })
  stockMinimo!: number

  @Prop({ type: Boolean, default: true })
  activo!: boolean
}

export const ProductosSchema = SchemaFactory.createForClass(Productos)
