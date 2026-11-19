import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CitaDocument = HydratedDocument<Cita>

export enum EstadoAtencion {
  PENDIENTE = 'pendiente',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
}

@Schema({ _id: false })
export class MaterialConsumido {
  @Prop({ type: Types.ObjectId, ref: 'Productos', required: true })
  producto!: Types.ObjectId

  // Datos guardados como estaban cuando se realizó el servicio
  @Prop({ required: true })
  nombre!: string

  @Prop({ required: true })
  codigo!: string

  @Prop({ required: true, min: 0 })
  cantidad!: number

  @Prop({ required: true, min: 0 })
  precioUnitario!: number

  @Prop({ required: true, min: 0 })
  costoTotal!: number
}

export const MaterialConsumidoSchema =
  SchemaFactory.createForClass(MaterialConsumido)

@Schema()
export class Cita {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Cliente' })
  cliente!: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'Servicios' })
  servicio!: Types.ObjectId

  @Prop({ required: true })
  fecha!: Date

  @Prop({ type: Boolean, default: false })
  procesandoRealizacion!: boolean

  @Prop({
    type: String,
    enum: Object.values(EstadoAtencion),
    default: EstadoAtencion.PENDIENTE,
  })
  estadoAtencion!: EstadoAtencion

  @Prop({
    type: String,
    enum: Object.values(EstadoPago),
    default: EstadoPago.PENDIENTE,
  })
  estadoPago!: EstadoPago

  @Prop({ type: Number, min: 0, default: 0 })
  precioCobrado!: number

  @Prop({ type: Types.ObjectId, ref: 'Moneda', default: null })
  monedaCobro!: Types.ObjectId | null

  @Prop({ type: Date, default: null })
  fechaRealizacion!: Date | null

  @Prop({ type: [MaterialConsumidoSchema], default: [] })
  materialesConsumidos!: MaterialConsumido[]
}

export const CitaSchema = SchemaFactory.createForClass(Cita)
