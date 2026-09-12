import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Configuracion, ConfiguracionSchema } from './schema/configuracion.schema';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Configuracion.name, schema: ConfiguracionSchema },
    ]),
  ],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
})
export class ConfiguracionModule {}