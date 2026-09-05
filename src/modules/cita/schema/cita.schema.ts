import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CitaDocument = HydratedDocument<Cita>;

@Schema()
export class Cita {

    @Prop({ required: true, type: Types.ObjectId, ref: 'Cliente', })
    cliente!: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Servicios', })
    servicio!: Types.ObjectId;

    @Prop({ required: true, unique: true })
    fecha!: Date;
}

export const CitaSchema = SchemaFactory.createForClass(Cita);