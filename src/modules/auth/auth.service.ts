
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { Modulo } from './enums/modulo.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  // ==========================================
  // CREAR USUARIO
  // ==========================================

  async register(dto: RegisterDto) {
    const nombre = dto.nombre.trim();
    const telefono = dto.telefono.trim();

    const existingUser = await this.userModel.findOne({
      $or: [{ nombre }, { telefono }],
    }).exec();

    if (existingUser) {
      if (existingUser.nombre === nombre) {
        throw new ConflictException(
          'El nombre de usuario ya está registrado',
        );
      }

      throw new ConflictException(
        'El teléfono ya está registrado',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      12,
    );

    try {
      const created = await this.userModel.create({
        nombre,
        telefono,
        password: hashedPassword,
        role: Role.USER,
        permisos: dto.permisos ?? [],
      });

      const user = created.toObject();
      delete (user as Partial<typeof user>).password;

      return {
        message: 'Usuario creado correctamente',
        user,
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException(
          'El nombre de usuario o teléfono ya está registrado',
        );
      }

      throw error;
    }
  }

  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ nombre: dto.nombre.trim() })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const accessToken = this.jwtService.sign(
      {},
      {
        subject: user._id.toString(),
      },
    );

    const userData = user.toObject();
    delete (userData as Partial<typeof userData>).password;

    return {
      message: 'Inicio de sesión exitoso',
      user: userData,
      access_token: accessToken,
    };
  }

  // ==========================================
  // PERFIL DEL USUARIO AUTENTICADO
  // ==========================================

  async profile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .exec();

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    const result = user.toObject();
    delete (result as Partial<typeof result>).password;

    return result;
  }

  // ==========================================
  // LISTAR USUARIOS
  // ==========================================

  async getUsers() {
    return this.userModel
      .find()
      .select('_id nombre telefono role permisos createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ) {
    const user = await this.userModel
      .findById(id)
      .exec();

    if (!user) {
      throw new NotFoundException(
        'El usuario no existe',
      );
    }

    const datosActualizar: {
      nombre?: string;
      telefono?: string;
      password?: string;
      permisos?: Modulo[];
    } = {};

    if (dto.nombre !== undefined) {
      datosActualizar.nombre = dto.nombre.trim();
    }

    if (dto.telefono !== undefined) {
      datosActualizar.telefono = dto.telefono.trim();
    }

    if (dto.password !== undefined) {
      datosActualizar.password = await bcrypt.hash(
        dto.password,
        12,
      );
    }

    if (dto.permisos !== undefined) {
      datosActualizar.permisos = dto.permisos;
    }

    if (Object.keys(datosActualizar).length === 0) {
      throw new BadRequestException(
        'Debes proporcionar al menos un dato para actualizar',
      );
    }

    try {
      const actualizado = await this.userModel
        .findByIdAndUpdate(
          id,
          { $set: datosActualizar },
          {
            new: true,
            runValidators: true,
          },
        )
        .select('_id nombre telefono role permisos createdAt updatedAt')
        .exec();

      if (!actualizado) {
        throw new NotFoundException(
          'El usuario no existe',
        );
      }

      return {
        message: 'Usuario actualizado correctamente',
        user: actualizado,
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException(
          'El nombre de usuario o teléfono ya está registrado',
        );
      }

      throw error;
    }
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  async deleteUser(
    id: string,
    usuarioAutenticadoId: string,
  ) {
    if (id === usuarioAutenticadoId) {
      throw new ForbiddenException(
        'No puedes eliminar tu propia cuenta',
      );
    }

    const user = await this.userModel
      .findById(id)
      .exec();

    if (!user) {
      throw new NotFoundException(
        'El usuario no existe',
      );
    }

    // Las cuentas ADMIN no se eliminan desde el panel.
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException(
        'No está permitido eliminar una cuenta de administrador',
      );
    }

    await this.userModel
      .findByIdAndDelete(id)
      .exec();

    return {
      message: 'Usuario eliminado correctamente',
    };
  }
}


