import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import {
  MODULE_PERMISSION_KEY,
} from '../decorators/module-permissions.decorator';

import { Role } from '../enums/role.enum';
import { Modulo } from '../enums/modulo.enum';

interface UsuarioAutenticado {
  userId: string;
  nombre: string;
  telefono: string;
  role: Role;
  permisos: Modulo[];
}

@Injectable()
export class ModulePermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const modulo = this.reflector.getAllAndOverride<Modulo>(
      MODULE_PERMISSION_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // Si la ruta no exige un módulo, no se aplica este guard.
    if (!modulo) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user as UsuarioAutenticado | undefined;

    if (!usuario) {
      throw new ForbiddenException(
        'No se pudo verificar el usuario autenticado',
      );
    }

    // El administrador tiene acceso completo.
    if (usuario.role === Role.ADMIN) {
      return true;
    }

    if (!usuario.permisos?.includes(modulo)) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este módulo',
      );
    }

    return true;
  }
}