
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ProductosController } from './productos.controller'
import { ProductosService } from './productos.service'
import { Productos, ProductosSchema } from './schema/productos.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Productos.name,
        schema: ProductosSchema,
      },
    ]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
