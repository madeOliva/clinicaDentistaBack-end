import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cita, CitaSchema } from './schema/cita.schema';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  controllers: [CitaController],
  providers: [CitaService],

  imports: [
    ConfiguracionModule,
    MongooseModule.forFeature([{
      name: Cita.name,
      schema: CitaSchema,},]),
    ],
  exports: [MongooseModule],
})


export class CitaModule {}