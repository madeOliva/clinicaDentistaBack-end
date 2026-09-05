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
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: Role.USER,
    });

    const user = created.toObject();

    return {
      message: 'Usuario registrado correctamente',
      user,
      access_token: this.signToken(
        user._id.toString(),
        user.email,
        user.role,
        user.isSuperAdmin,
      ),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
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
    delete payload.password;

    return {
      message: 'Inicio de sesión exitoso',
      user: payload,
      access_token: this.signToken(
        user._id.toString(),
        user.email,
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
    return user;
  }

  private signToken(
    sub: string,
    email: string,
    role: string,
    isSuperAdmin: boolean,
  ): string {
    return this.jwtService.sign({ email, role, isSuperAdmin }, {
      subject: sub,
    });
  }
}