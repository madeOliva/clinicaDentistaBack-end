import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) { }

  @ApiOperation({ summary: 'Registrar un nuevo servicio' })
  @ApiResponse({ status: 201, description: 'Servicio registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }


  @ApiOperation({ summary: 'Obtener todos los servicios' })
  @ApiResponse({ status: 201, description: 'Servicios obtenidos con éxito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }


  @ApiOperation({ summary: 'Obtener todas los servicios' })
  @ApiResponse({ status: 201, description: 'Servicios obtenidas con éxito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviciosService.findOne(id);
  }


  @ApiOperation({ summary: 'Modificar un servicio' })
  @ApiResponse({ status: 201, description: 'Servicio modificado con éxito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @ApiOperation({ summary: 'Eliminar un servicio' })
  @ApiResponse({ status: 201, description: 'Servicio eliminado con éxito' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviciosService.remove(id);
  }
}


