import { Module } from '@nestjs/common';
import { DiasInhabilitadosService } from './dias-inhabilitados.service';
import { DiasInhabilitadosController } from './dias-inhabilitados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiaInhabilitado, DiaInhabilitadoSchema } from './schema/dia-inhabilitado.schema';

@Module({
  controllers: [DiasInhabilitadosController],
  providers: [DiasInhabilitadosService],

   imports: [MongooseModule.forFeature([{
        name: DiaInhabilitado.name,
        schema: DiaInhabilitadoSchema,},]),],
      exports: [MongooseModule],
})


export class DiasInhabilitadosModule {}