
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CompraDocument = HydratedDocument<Compra>

@Schema({ timestamps: true })
export class Compra {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Productos',
  })
  producto!: Types.ObjectId

  @Prop({ required: true, min: 1 })
  cantidad!: number

  @Prop({ required: true, min: 0 })
  precioUnitario!: number

  @Prop({ required: true, min: 0 })
  total!: number

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Moneda',
  })
  moneda!: Types.ObjectId

  // Código de moneda guardado como referencia histórica
  @Prop({ required: true })
  monedaCodigo!: string

  @Prop({ default: '' })
  proveedor!: string

  @Prop({ required: true, default: Date.now })
  fechaCompra!: Date

  @Prop({ default: '' })
  observaciones!: string
}

export const CompraSchema = SchemaFactory.createForClass(Compra)
