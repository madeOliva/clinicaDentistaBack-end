import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { esCiValida } from "../dto/ci-validator";

export type ClienteDocument = HydratedDocument<Cliente>;

@Schema()
export class Cliente {

    @Prop({
        required: true,
        unique: true,
        validate: {
            validator: (v: string) => typeof v === 'string' && esCiValida(v),
            message: 'El CI debe tener 11 dígitos y una fecha de nacimiento válida (mes 01-12 y día válido para el mes)',
        },
    })
    ci!: string;

    @Prop({ required: true, match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo debe contener letras'] })
    nombre!: string;

    @Prop({ required: true, match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'Los apellidos solo deben contener letras'] })
    apellidos!: string;

    @Prop({ required: true, match: [/^[0-9+\s-]+$/, 'El teléfono solo debe contener números'] })
    telefono!: string;

    @Prop()
    edad?: number;

    @Prop()
    direccion?: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);