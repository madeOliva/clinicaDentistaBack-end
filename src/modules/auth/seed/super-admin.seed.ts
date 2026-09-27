import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { Role } from '../enums/role.enum';

@Injectable()
export class SuperAdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminSeeder.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const telefono = this.configService.get<string>('SUPERADMIN_TELEFONO');
    const password = this.configService.get<string>('SUPERADMIN_PASSWORD');

    if (!telefono || !password) {
      this.logger.warn(
        'SUPERADMIN_TELEFONO/SUPERADMIN_PASSWORD no configurados. No se creó superadmin.',
      );
      return;
    }

    const existing = await this.userModel.findOne({ telefono }).exec();
    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      telefono,
      password: hashedPassword,
      nombre: this.configService.get<string>('SUPERADMIN_NAME') ?? 'Super Admin',
      role: Role.ADMIN,
      isSuperAdmin: true,
    });

    this.logger.log(`SuperAdmin creado por defecto: ${telefono}`);
  }
}