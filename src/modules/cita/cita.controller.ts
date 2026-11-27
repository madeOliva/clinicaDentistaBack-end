import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { RequireModule } from '../auth/decorators/module-permissions.decorator';
import { Modulo } from '../auth/enums/modulo.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModulePermissionsGuard } from '../auth/guards/module-permissions.guard';


@ApiTags('Cita')

export class CitaController {
  constructor(private readonly citaService: CitaService) { }

  @ApiOperation({ summary: 'Registrar una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita registrada con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
  }


  @Patch(':id/realizar')
  @ApiOperation({ summary: 'Marcar una cita como realizada y descontar materiales' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  async realizar(@Param('id') id: string) {
    return this.citaService.realizar(id)
  }

  @Patch(':id/pagar')
  @ApiOperation({
    summary: 'Registrar el pago de una cita realizada',
  })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({
    status: 200,
    description: 'Pago registrado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'La cita no está realizada o ya fue pagada',
  })
  registrarPago(
    @Param('id') id: string,
    @Body() registrarPagoDto: RegistrarPagoDto,
  ) {
    return this.citaService.registrarPago(
      id,
      registrarPagoDto.precioCobrado,
    )
  }



  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 201, description: 'Citas obtenidas con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  findAll() {
    return this.citaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una cita' })
  @ApiResponse({ status: 201, description: 'Cita obtenida con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citaService.findOne(id);
  }

  @ApiOperation({ summary: 'Modificar una cita' })
  @ApiResponse({ status: 201, description: 'Cita modificada con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citaService.update(id, updateCitaDto);
  }

  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiResponse({ status: 201, description: 'Cita eliminada con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citaService.remove(id);
  }
}