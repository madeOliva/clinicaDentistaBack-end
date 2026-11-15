
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type MovimientosDocument = HydratedDocument<Movimientos>

export enum TipoMovimiento {
    ENTRADA = 'entrada',
    SALIDA = 'salida',
}

@Schema({ timestamps: true })
export class Movimientos {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Productos',
    })
    producto!: Types.ObjectId

    @Prop({
        required: true,
        enum: TipoMovimiento,
    })
    tipo!: TipoMovimiento

    @Prop({
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'La cantidad debe ser un número entero',
        },
    })
    cantidad!: number

    @Prop({
        required: true,
        min: 0,
    })
    stockAnterior!: number

    @Prop({
        required: true,
        min: 0,
    })
    stockResultante!: number

    @Prop({
        default: '',
        trim: true,
    })
    motivo!: string

    @Prop({
        type: Date,
        default: Date.now,
    })
    fechaMovimiento!: Date
}

export const MovimientosSchema =
    SchemaFactory.createForClass(Movimientos)
