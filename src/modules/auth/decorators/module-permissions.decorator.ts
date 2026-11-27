import { SetMetadata } from '@nestjs/common';
import { Modulo } from '../enums/modulo.enum';

export const MODULE_PERMISSION_KEY = 'module_permission';

export const RequireModule = (modulo: Modulo) =>
  SetMetadata(MODULE_PERMISSION_KEY, modulo);