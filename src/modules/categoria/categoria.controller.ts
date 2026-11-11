import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common'

import { CategoriasService } from './categoria.service'

import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
  ) {}

  @Get()
  findAll() {
    return this.categoriasService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(id)
  }

  @Post()
  create(
    @Body() createCategoriaDto: CreateCategoriaDto,
  ) {
    return this.categoriasService.create(
      createCategoriaDto,
    )
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(
      id,
      updateCategoriaDto,
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id)
  }
}