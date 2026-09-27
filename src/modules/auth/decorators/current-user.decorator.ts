import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ActiveUser {
  userId: string;
  telefono: string;
  role: string;
  isSuperAdmin: boolean;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ActiveUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);