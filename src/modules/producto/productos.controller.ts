
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'

import { ProductosService } from './productos.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { RequireModule } from '../auth/decorators/module-permissions.decorator'
import { Modulo } from '../auth/enums/modulo.enum'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ModulePermissionsGuard } from '../auth/guards/module-permissions.guard'

@ApiTags('Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard, ModulePermissionsGuard)
@RequireModule(Modulo.PRODUCTOS)
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto registrado con éxito' })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll() {
    return this.productosService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un producto' })
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(id)
  }
}
