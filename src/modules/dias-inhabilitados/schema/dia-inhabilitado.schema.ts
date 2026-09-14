import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DiaInhabilitadoDocument = HydratedDocument<DiaInhabilitado>;

@Schema()
export class DiaInhabilitado {

    @Prop({ required: true })
    fecha!: Date;
}

export const DiaInhabilitadoSchema = SchemaFactory.createForClass(DiaInhabilitado);