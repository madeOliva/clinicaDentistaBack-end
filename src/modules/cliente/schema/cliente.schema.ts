import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ClienteDocument = HydratedDocument<Cliente>;

@Schema()
export class Cliente {

    @Prop({ required: true, unique: true })
    ci!: string;

    @Prop({ required: true })
    nombre!: string;

    @Prop({ required: true })
    apellidos!: string;

    @Prop({ required: true })
    telefono!: string;

    @Prop()
    direccion?: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);