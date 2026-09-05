import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cita, CitaSchema } from './schema/cita.schema';

@Module({
  controllers: [CitaController],
  providers: [CitaService],

  imports: [MongooseModule.forFeature([{
      name: Cita.name,
      schema: CitaSchema,},]),],
    exports: [MongooseModule],
})


export class CitaModule {}