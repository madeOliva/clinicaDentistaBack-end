import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import {
  User,
  UserSchema,
} from './schema/user.schema';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { AdminSeeder } from './seed/admin.seed';
import { ModulePermissionsGuard } from './guards/module-permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error(
            'JWT_SECRET no está configurado',
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn:
              configService.get<string>('JWT_EXPIRES_IN') ?? '1d',
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ModulePermissionsGuard,
    AdminSeeder,
  ],

  exports: [
    JwtModule,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ModulePermissionsGuard,
  ],
})
export class AuthModule {}