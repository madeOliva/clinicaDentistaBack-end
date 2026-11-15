
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Productos, ProductosDocument } from '../producto/schema/productos.schema'
import { CreateMovimientoDto } from './dto/create-movimeintos.dto'
import { UpdateMovimientoDto } from './dto/update-movimientos.dto'
import { Movimientos, MovimientosDocument, TipoMovimiento } from './schema/movimientos.schema'
import { ConsultarMovimientosDto } from './dto/consultar-movimientos.dto'



@Injectable()
export class MovimientosService {
  constructor(
    @InjectModel(Movimientos.name)
    private readonly movimientosModel: Model<MovimientosDocument>,

    @InjectModel(Productos.name)
    private readonly productosModel: Model<ProductosDocument>,
  ) {}

  async create(dto: CreateMovimientoDto) {
    const productoId = new Types.ObjectId(dto.producto)

    const producto = await this.productosModel
      .findOne({
        _id: productoId,
        activo: true,
      })
      .exec()

    if (!producto) {
      throw new NotFoundException(
        'El producto no existe o está inactivo',
      )
    }

    const cantidad = dto.cantidad
    let productoActualizado: ProductosDocument | null = null

    if (dto.tipo === TipoMovimiento.ENTRADA) {
      productoActualizado = await this.productosModel
        .findOneAndUpdate(
          {
            _id: productoId,
            activo: true,
          },
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
    } else {
      productoActualizado = await this.productosModel
        .findOneAndUpdate(
          {
            _id: productoId,
            activo: true,
            stock: {
              $gte: cantidad,
            },
          },
          {
            $inc: {
              stock: -cantidad,
            },
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec()

      if (!productoActualizado) {
        throw new BadRequestException(
          'No hay suficiente stock para realizar esta salida',
        )
      }
    }

    if (!productoActualizado) {
      throw new NotFoundException(
        'No se pudo actualizar el stock del producto',
      )
    }

    const stockResultante = productoActualizado.stock

    const stockAnterior =
      dto.tipo === TipoMovimiento.ENTRADA
        ? stockResultante - cantidad
        : stockResultante + cantidad

    try {
      const movimiento = await this.movimientosModel.create({
        producto: productoId,
        tipo: dto.tipo,
        cantidad,
        stockAnterior,
        stockResultante,
        motivo: dto.motivo ?? '',
        fechaMovimiento: new Date(),
      })

      return this.movimientosModel
        .findById(movimiento._id)
        .populate(
          'producto',
          'codigo nombre categoria unidadMedida',
        )
        .exec()
    } catch {
      const cantidadRevertir =
        dto.tipo === TipoMovimiento.ENTRADA
          ? -cantidad
          : cantidad

      await this.productosModel
        .updateOne(
          { _id: productoId },
          {
            $inc: {
              stock: cantidadRevertir,
            },
          },
        )
        .exec()

      throw new BadRequestException(
        'No se pudo registrar el movimiento. El stock fue revertido.',
      )
    }
  }

  async findAll(filtros: ConsultarMovimientosDto) {
    const query: Record<string, any> = {}

    if (filtros.producto) {
      query.producto = new Types.ObjectId(filtros.producto)
    }

    if (filtros.tipo) {
      query.tipo = filtros.tipo
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
      query.fechaMovimiento = {}

      if (filtros.fechaDesde) {
        query.fechaMovimiento.$gte = new Date(
          filtros.fechaDesde,
        )
      }

      if (filtros.fechaHasta) {
        const fechaHasta = new Date(filtros.fechaHasta)
        fechaHasta.setHours(23, 59, 59, 999)

        query.fechaMovimiento.$lte = fechaHasta
      }
    }

    return this.movimientosModel
      .find(query)
      .populate(
        'producto',
        'codigo nombre categoria unidadMedida',
      )
      .sort({ fechaMovimiento: -1 })
      .exec()
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'El ID del movimiento no es válido',
      )
    }

    const movimiento = await this.movimientosModel
      .findById(id)
      .populate(
        'producto',
        'codigo nombre categoria unidadMedida',
      )
      .exec()

    if (!movimiento) {
      throw new NotFoundException(
        'El movimiento no existe',
      )
    }

    return movimiento
  }

  async update(id: string, dto: UpdateMovimientoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'El ID del movimiento no es válido',
      )
    }

    const movimiento = await this.movimientosModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            motivo: dto.motivo,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate(
        'producto',
        'codigo nombre categoria unidadMedida',
      )
      .exec()

    if (!movimiento) {
      throw new NotFoundException(
        'El movimiento no existe',
      )
    }

    return movimiento
  }
}
