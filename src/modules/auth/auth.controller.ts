
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

import {
  CurrentUser,
  ActiveUser,
} from './decorators/current-user.decorator';

import { Role } from './enums/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  // ==========================================
  // CREAR USUARIO
  // ==========================================

  @Post('register')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ==========================================
  // PERFIL
  // ==========================================

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Consultar el perfil del usuario autenticado',
  })
  profile(@CurrentUser() user: ActiveUser) {
    return this.authService.profile(user.userId);
  }

  // ==========================================
  // LISTAR USUARIOS
  // ==========================================

  @Get('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Listar usuarios (solo administradores)',
  })
  getUsers() {
    return this.authService.getUsers();
  }

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  @Patch('users/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Editar usuario (solo administradores)',
  })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, dto);
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  @Delete('users/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Eliminar usuario (solo administradores)',
  })
  deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: ActiveUser,
  ) {
    return this.authService.deleteUser(
      id,
      user.userId,
    );
  }
}
