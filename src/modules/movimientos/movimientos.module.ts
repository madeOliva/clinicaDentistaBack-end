
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MovimientosController } from './movimientos.controller'
import { Productos, ProductosSchema } from '../producto/schema/productos.schema'
import { Movimientos, MovimientosSchema } from './schema/movimientos.schema'
import { MovimientosService } from './movimientos.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Movimientos.name,
        schema: MovimientosSchema,
      },
      {
        name: Productos.name,
        schema: ProductosSchema,
      },
    ]),
  ],
  controllers: [MovimientosController],
  providers: [MovimientosService],
  exports: [MovimientosService],
})
export class MovimientosModule {}
