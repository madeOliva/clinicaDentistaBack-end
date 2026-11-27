import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../enums/role.enum';
import { Modulo } from '../enums/modulo.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  })
  nombre: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[0-9+\s-]+$/,
      'El teléfono solo debe contener números',
    ],
  })
  telefono: string;

  @Prop({
    required: true,
    minlength: 8,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
    required: true,
  })
  role: Role;

  @Prop({
  type: [String],
  enum: Object.values(Modulo),
  default: [],
})
permisos: Modulo[];
}

export const UserSchema = SchemaFactory.createForClass(User);