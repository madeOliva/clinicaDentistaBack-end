import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Cita')
@Controller('cita')
export class CitaController {
  constructor(private readonly citaService: CitaService) { }

  @ApiOperation({ summary: 'Registrar una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita registrada con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
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