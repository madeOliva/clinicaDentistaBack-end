
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';

import {
  Servicios,
  ServiciosSchema,
} from './schema/servicios.schema';

import {
  Moneda,
  MonedaSchema,
} from '../moneda/schema/moneda.schema';
import { Productos, ProductosSchema } from '../producto/schema/productos.schema';


@Module({
  controllers: [ServiciosController],
  providers: [ServiciosService],

  imports: [
    MongooseModule.forFeature([
      {
        name: Servicios.name,
        schema: ServiciosSchema,
      },
      {
        name: Moneda.name,
        schema: MonedaSchema,
      },
      {
        name: Productos.name,
        schema: ProductosSchema,
      },
    ]),
  ],

  exports: [MongooseModule],
})
export class ServiciosModule {}
