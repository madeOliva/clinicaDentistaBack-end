
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'


import { MonedaModule } from '../moneda/moneda.module'
import { Productos, ProductosSchema } from '../producto/schema/productos.schema'
import { Compra, CompraSchema } from './schema/compras.schema'
import { ComprasController } from './compras.controller'
import { ComprasService } from './compras.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Compra.name,
        schema: CompraSchema,
      },
      {
        name: Productos.name,
        schema: ProductosSchema,
      },
    ]),
    MonedaModule,
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}
