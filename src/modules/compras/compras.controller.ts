
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { ComprasService } from './compras.service'
import { CreateCompraDto } from './dto/create-compras.dto'

@ApiTags('Compras')
@Controller('compras')
export class ComprasController {
  constructor(
    private readonly comprasService: ComprasService,
  ) {}

  // Registrar una compra
  @Post()
  @ApiOperation({
    summary: 'Registrar una compra de productos',
  })
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto)
  }

  // Obtener todas las compras
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las compras',
  })
  findAll() {
    return this.comprasService.findAll()
  }

  // Obtener una compra por ID
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una compra por ID',
  })
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(id)
  }
}
