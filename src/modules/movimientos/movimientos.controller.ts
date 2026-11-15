
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { MovimientosService } from './movimientos.service'
import { CreateMovimientoDto } from './dto/create-movimeintos.dto'
import { ConsultarMovimientosDto } from './dto/consultar-movimientos.dto'
import { UpdateMovimientoDto } from './dto/update-movimientos.dto'


@ApiTags('Movimientos')
@Controller('movimientos')
export class MovimientosController {
  constructor(
    private readonly movimientosService: MovimientosService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar una entrada o salida de inventario',
  })
  @ApiResponse({
    status: 201,
    description: 'Movimiento registrado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o stock insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  create(@Body() dto: CreateMovimientoDto) {
    return this.movimientosService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los movimientos',
  })
  findAll(@Query() filtros: ConsultarMovimientosDto) {
    return this.movimientosService.findAll(filtros)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un movimiento por ID',
  })
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar el motivo de un movimiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Movimiento no encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovimientoDto,
  ) {
    return this.movimientosService.update(id, dto)
  }
}
