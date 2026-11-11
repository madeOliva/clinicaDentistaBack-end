import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Categoria, CategoriaSchema } from './schema/categoria.schema'
import { CategoriasController } from './categoria.controller'
import { CategoriasService } from './categoria.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Categoria.name,
        schema: CategoriaSchema,
      },
    ]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}