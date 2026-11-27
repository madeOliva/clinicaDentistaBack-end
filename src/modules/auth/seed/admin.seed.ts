import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../schema/user.schema';
import { Role } from '../enums/role.enum';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const nombre = this.configService
      .get<string>('ADMIN_NAME')
      ?.trim();

    const telefono = this.configService
      .get<string>('ADMIN_PHONE')
      ?.trim();

    const password = this.configService.get<string>(
      'ADMIN_PASSWORD',
    );

    if (!nombre || !telefono || !password) {
      throw new Error(
        'Faltan ADMIN_NAME, ADMIN_PHONE o ADMIN_PASSWORD en el archivo .env',
      );
    }

    if (password.length < 12) {
      throw new Error(
        'ADMIN_PASSWORD debe tener al menos 12 caracteres',
      );
    }

    const existingAdmin = await this.userModel
      .findOne({ role: Role.ADMIN })
      .exec();

    if (existingAdmin) {
      this.logger.log(
        'Ya existe un administrador. No se creó otra cuenta.',
      );
      return;
    }

    const existingUser = await this.userModel
      .findOne({
        $or: [{ nombre }, { telefono }],
      })
      .exec();

    if (existingUser) {
      throw new Error(
        'El nombre o teléfono configurado para el administrador ya pertenece a otro usuario. Revisa ADMIN_NAME y ADMIN_PHONE.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userModel.create({
      nombre,
      telefono,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    this.logger.log(
      'Primer administrador creado correctamente.',
    );
  }
}