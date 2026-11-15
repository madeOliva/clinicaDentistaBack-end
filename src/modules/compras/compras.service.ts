
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Moneda } from '../moneda/schema/moneda.schema'
import { Productos } from '../producto/schema/productos.schema'
import { CreateCompraDto } from './dto/create-compras.dto'
import { Compra } from './schema/compras.schema'



@Injectable()
export class ComprasService {
  constructor(
    @InjectModel(Compra.name)
    private readonly comprasModel: Model<Compra>,

    @InjectModel(Productos.name)
    private readonly productosModel: Model<Productos>,

    @InjectModel(Moneda.name)
    private readonly monedaModel: Model<Moneda>,
  ) {}

  // Registrar una compra e incrementar el stock
  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    const {
      productoId,
      cantidad,
      precioUnitario,
      monedaId,
      proveedor,
      fechaCompra,
      observaciones,
    } = createCompraDto

    if (!Types.ObjectId.isValid(productoId)) {
      throw new BadRequestException(
        'El ID del producto no es válido',
      )
    }

    if (!Types.ObjectId.isValid(monedaId)) {
      throw new BadRequestException(
        'El ID de la moneda no es válido',
      )
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new BadRequestException(
        'La cantidad debe ser un número entero mayor que cero',
      )
    }

    if (!Number.isFinite(precioUnitario) || precioUnitario < 0) {
      throw new BadRequestException(
        'El precio unitario no es válido',
      )
    }

    const producto = await this.productosModel
      .findById(productoId)
      .exec()

    if (!producto) {
      throw new NotFoundException(
        'No se encontró el producto',
      )
    }

    const moneda = await this.monedaModel
      .findById(monedaId)
      .exec()

    if (!moneda) {
      throw new NotFoundException(
        'No se encontró la moneda',
      )
    }

    const total = cantidad * precioUnitario

    // Aumentar el stock del producto
    const productoActualizado = await this.productosModel
      .findByIdAndUpdate(
        productoId,
        {
          $inc: {
            stock: cantidad,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec()

    if (!productoActualizado) {
      throw new NotFoundException(
        'No se pudo actualizar el stock del producto',
      )
    }

    try {
      const nuevaCompra = new this.comprasModel({
        producto: new Types.ObjectId(productoId),
        cantidad,
        precioUnitario,
        total,
        moneda: new Types.ObjectId(monedaId),
        monedaCodigo: moneda.tipoMoneda,
        proveedor: proveedor ?? '',
        fechaCompra: fechaCompra
          ? new Date(fechaCompra)
          : new Date(),
        observaciones: observaciones ?? '',
      })

      return await nuevaCompra.save()
    } catch (error) {
      // Si falla el registro de la compra,
      // revertimos el incremento del stock.
      await this.productosModel
        .findByIdAndUpdate(productoId, {
          $inc: {
            stock: -cantidad,
          },
        })
        .exec()

      throw error
    }
  }

  // Obtener todas las compras
  async findAll(): Promise<Compra[]> {
    return this.comprasModel
      .find()
      .populate('producto')
      .populate('moneda')
      .sort({ fechaCompra: -1 })
      .exec()
  }

  // Buscar una compra por ID
  async findOne(id: string): Promise<Compra> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'El ID de la compra no es válido',
      )
    }

    const compra = await this.comprasModel
      .findById(id)
      .populate('producto')
      .populate('moneda')
      .exec()

    if (!compra) {
      throw new NotFoundException(
        'No se encontró la compra',
      )
    }

    return compra
  }
}
