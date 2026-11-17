
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ServiciosDocument = HydratedDocument<Servicios>;

@Schema()
export class Servicios {
    @Prop({ required: true, unique: true })
    nombreServicio!: string;

    @Prop({ required: true, unique: true })
    descripcionServicio!: string;

    @Prop({ required: true })
    precioServicio!: number;

    @Prop({ type: Boolean, default: true })
    disponible!: boolean;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Moneda',
    })
    monedaServicio!: Types.ObjectId;

    @Prop({
        type: [
            {
                producto: {
                    type: Types.ObjectId,
                    ref: 'Productos',
                    required: true,
                },
                cantidad: {
                    type: Number,
                    required: true,
                    min: 0.01,
                },
            },
        ],
        default: [],
    })
    materiales!: {
        producto: Types.ObjectId;
        cantidad: number;
    }[];
}

export const ServiciosSchema =
    SchemaFactory.createForClass(Servicios);
