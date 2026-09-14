import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiasInhabilitadosService } from './dias-inhabilitados.service';
import { CreateDiaInhabilitadoDto } from './dto/create-dia-inhabilitado.dto';
import { UpdateDiaInhabilitadoDto } from './dto/update-dia-inhabilitado.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('DiasInhabilitados')
@Controller('dias-inhabilitados')
export class DiasInhabilitadosController {
  constructor(private readonly diasInhabilitadosService: DiasInhabilitadosService) { }

  @ApiOperation({ summary: 'Registrar un día inhabilitado' })
  @ApiResponse({ status: 201, description: 'Día inhabilitado registrado con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createDiaDto: CreateDiaInhabilitadoDto) {
    return this.diasInhabilitadosService.create(createDiaDto);
  }


  @ApiOperation({ summary: 'Obtener todos los días inhabilitados' })
  @ApiResponse({ status: 201, description: 'Días obtenidos con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  findAll() {
    return this.diasInhabilitadosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un día inhabilitado' })
  @ApiResponse({ status: 201, description: 'Día obtenido con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diasInhabilitadosService.findOne(id);
  }

  @ApiOperation({ summary: 'Modificar un día inhabilitado' })
  @ApiResponse({ status: 201, description: 'Día modificado con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaDto: UpdateDiaInhabilitadoDto) {
    return this.diasInhabilitadosService.update(id, updateDiaDto);
  }

  @ApiOperation({ summary: 'Eliminar un día inhabilitado' })
  @ApiResponse({ status: 201, description: 'Día eliminado con exito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diasInhabilitadosService.remove(id);
  }
}