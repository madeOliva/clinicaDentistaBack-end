
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Productos } from './schema/productos.schema'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Productos.name)
    private readonly productosModel: Model<Productos>,
  ) {}

  // Registrar un producto
  async create(createProductoDto: CreateProductoDto): Promise<Productos> {
    const codigo = createProductoDto.codigo.trim().toUpperCase()

    const existente = await this.productosModel.findOne({ codigo }).exec()

    if (existente) {
      throw new BadRequestException(
        'Ya existe un producto con ese código',
      )
    }

    const nuevoProducto = new this.productosModel({
      ...createProductoDto,
      codigo,
      stock: createProductoDto.stock ?? 0,
      descripcion: createProductoDto.descripcion ?? '',
      activo: createProductoDto.activo ?? true,
    })

    return nuevoProducto.save()
  }

  // Obtener todos los productos
  async findAll(): Promise<Productos[]> {
    return this.productosModel
      .find()
      .sort({ createdAt: -1 })
      .exec()
  }

  // Buscar un producto por ID
  async findOne(id: string): Promise<Productos> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID del producto no es válido')
    }

    const producto = await this.productosModel.findById(id).exec()

    if (!producto) {
      throw new NotFoundException('No se encontró el producto')
    }

    return producto
  }

  // Actualizar un producto sin modificar el stock
  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Productos> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID del producto no es válido')
    }

    const actualizado = await this.productosModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateProductoDto,
            codigo: updateProductoDto.codigo
              ?.trim()
              .toUpperCase(),
          },
        },
        { new: true, runValidators: true },
      )
      .exec()

    if (!actualizado) {
      throw new NotFoundException('No se encontró el producto')
    }

    return actualizado
  }

  // Eliminar un producto
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID del producto no es válido')
    }

    const eliminado = await this.productosModel
      .findByIdAndDelete(id)
      .exec()

    if (!eliminado) {
      throw new NotFoundException('No se encontró el producto')
    }
  }
}
