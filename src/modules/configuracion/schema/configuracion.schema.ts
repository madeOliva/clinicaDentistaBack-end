import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfiguracionDocument = HydratedDocument<Configuracion>;

@Schema({ timestamps: true, versionKey: false })
export class Configuracion {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '', trim: true })
  address: string;

  @Prop({ default: '', trim: true })
  telephone: string;

  @Prop({ default: '', trim: true })
  email: string;

  @Prop({ default: '', trim: true })
  whatsapp: string;

  @Prop({ default: '', trim: true })
  whatsappUrl: string;

  @Prop({ default: '', trim: true })
  facebook: string;

  @Prop({ default: '', trim: true })
  instagram: string;

  @Prop({ type: [{ days: String, hours: String }], _id: false, default: [] })
  schedule: { days: string; hours: string }[];
}

export const ConfiguracionSchema = SchemaFactory.createForClass(Configuracion);