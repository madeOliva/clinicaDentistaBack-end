import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Servicios, ServiciosSchema } from './schema/servicios.schema';
import { Moneda, MonedaSchema } from '../moneda/schema/moneda.schema';

@Module({
  controllers: [ServiciosController],
  providers: [ServiciosService],

  imports: [MongooseModule.forFeature([{
    name: Servicios.name,
    schema: ServiciosSchema,
  },
  {
    name: Moneda.name,
    schema: MonedaSchema,
  },]),],
  exports: [MongooseModule],

})
export class ServiciosModule { }
