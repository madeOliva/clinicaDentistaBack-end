import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Role } from '../enums/role.enum';

export interface ActiveUser {
  userId: string;
  nombre: string;
  telefono: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ActiveUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);