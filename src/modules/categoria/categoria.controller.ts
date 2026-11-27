import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'

import { CategoriasService } from './categoria.service'

import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { Modulo } from '../auth/enums/modulo.enum'
import { RequireModule } from '../auth/decorators/module-permissions.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ModulePermissionsGuard } from '../auth/guards/module-permissions.guard'

@Controller('categorias')
@UseGuards(JwtAuthGuard, ModulePermissionsGuard)
@RequireModule(Modulo.CATEGORIAS)
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