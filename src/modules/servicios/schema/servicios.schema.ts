import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ServiciosDocument = HydratedDocument<Servicios>;

@Schema()
export class Servicios {


    @Prop({ required: true, unique: true })
    nombreServicio!: string;

    @Prop({ required: true, unique: true })
    descripcionServicio!: string;

    @Prop({ required: true, unique: true })
    precioServicio!: number;

    @Prop({ required: true, unique: true, })
    monedaServicio!: string;
}

export const ServiciosSchema = SchemaFactory.createForClass(Servicios);