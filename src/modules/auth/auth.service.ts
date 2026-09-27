import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ telefono: dto.telefono });
    if (existing) {
      throw new ConflictException('El teléfono ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      telefono: dto.telefono,
      password: hashedPassword,
      nombre: dto.nombre,
      role: dto.role ?? Role.USER,
    });

    const user = created.toObject();
    delete (user as Partial<typeof user>).password;

    return {
      message: 'Usuario registrado correctamente',
      user,
      access_token: this.signToken(
        user._id.toString(),
        user.telefono,
        user.role,
        user.isSuperAdmin,
      ),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ telefono: dto.telefono })
      .select('+password')
      .exec();
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = user.toObject();
    delete (payload as Partial<typeof payload>).password;

    return {
      message: 'Inicio de sesión exitoso',
      user: payload,
      access_token: this.signToken(
        user._id.toString(),
        user.telefono,
        user.role,
        user.isSuperAdmin,
      ),
    };
  }

  async profile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const result = user.toObject();
    delete (result as Partial<typeof result>).password;
    return result;
  }

  private signToken(
    sub: string,
    telefono: string,
    role: string,
    isSuperAdmin: boolean,
  ): string {
    return this.jwtService.sign({ telefono, role, isSuperAdmin }, {
      subject: sub,
    });
  }
}