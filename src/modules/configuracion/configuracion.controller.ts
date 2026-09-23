import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfiguracionService } from './configuracion.service';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@ApiTags('configuracion')
@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @ApiOperation({ summary: 'Obtener la configuración general del sitio' })
  @ApiResponse({ status: 200, type: CreateConfiguracionDto })
  @Get()
  obtener() {
    return this.configuracionService.encontrar();
  }

  @ApiOperation({ summary: 'Actualizar la configuración general del sitio' })
  @ApiResponse({ status: 200, type: CreateConfiguracionDto })
  @Patch()
  actualizar(@Body() dto: UpdateConfiguracionDto) {
    return this.configuracionService.actualizar(dto);
  }
}