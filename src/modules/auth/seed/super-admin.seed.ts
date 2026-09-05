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
    const email = this.configService.get<string>('SUPERADMIN_EMAIL');
    const password = this.configService.get<string>('SUPERADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.warn(
        'SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD no configurados. No se creó superadmin.',
      );
      return;
    }

    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      email,
      password: hashedPassword,
      name: this.configService.get<string>('SUPERADMIN_NAME') ?? 'Super Admin',
      role: Role.ADMIN,
      isSuperAdmin: true,
    });

    this.logger.log(`SuperAdmin creado por defecto: ${email}`);
  }
}