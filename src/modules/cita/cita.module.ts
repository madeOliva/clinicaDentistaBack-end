import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'


import { CitaService } from './cita.service'
import { CitaController } from './cita.controller'


import { ConfiguracionModule } from '../configuracion/configuracion.module'
import { Productos, ProductosSchema } from '../producto/schema/productos.schema'
import { Servicios, ServiciosSchema } from '../servicios/schema/servicios.schema'
import { Cita, CitaSchema } from './schema/cita.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cita.name,
        schema: CitaSchema,
      },
      {
        name: Servicios.name,
        schema: ServiciosSchema,
      },
      {
        name: Productos.name,
        schema: ProductosSchema,
      },
    ]),
    ConfiguracionModule,
  ],
  controllers: [CitaController],
  providers: [CitaService],
  exports: [CitaService],
})
export class CitaModule {}