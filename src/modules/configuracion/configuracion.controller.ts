import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfiguracionService } from './configuracion.service';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { RequireModule } from '../auth/decorators/module-permissions.decorator';
import { Modulo } from '../auth/enums/modulo.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModulePermissionsGuard } from '../auth/guards/module-permissions.guard';

@ApiTags('configuracion')
@Controller('configuracion')
@UseGuards(JwtAuthGuard, ModulePermissionsGuard)
@RequireModule(Modulo.CONFIGURACION)
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