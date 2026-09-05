import { ForbiddenException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isSuperAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

function isSuperAdminUpdate(update: Record<string, any>): boolean {
  const $set = update?.$set;
  return Boolean(
    (update?.isSuperAdmin === true) || ($set?.isSuperAdmin === true),
  );
}

const blockSuperAdminModification = async function (next) {
  const filter = this.getFilter();
  const update = this.getUpdate();

  if (isSuperAdminUpdate(update)) {
    throw new ForbiddenException(
      'El superadministrador no se puede modificar',
    );
  }

  const target = await this.model.findOne({ ...filter, isSuperAdmin: true });
  if (target) {
    throw new ForbiddenException(
      'El superadministrador no se puede modificar',
    );
  }

  next();
};

const blockSuperAdminDeletion = async function (next) {
  const filter = this.getFilter();
  const target = await this.model.findOne({ ...filter, isSuperAdmin: true });
  if (target) {
    throw new ForbiddenException(
      'El superadministrador no se puede eliminar',
    );
  }

  next();
};

UserSchema.pre('findOneAndUpdate', blockSuperAdminModification);
UserSchema.pre('updateOne', blockSuperAdminModification);
UserSchema.pre('updateMany', blockSuperAdminModification);
UserSchema.pre('deleteOne', blockSuperAdminDeletion);
UserSchema.pre('deleteMany', blockSuperAdminDeletion);
UserSchema.pre('findOneAndDelete', blockSuperAdminDeletion);