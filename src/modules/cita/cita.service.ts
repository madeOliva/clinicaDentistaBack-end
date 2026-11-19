
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateCitaDto } from './dto/create-cita.dto'
import { UpdateCitaDto } from './dto/update-cita.dto'

import {
  Cita,
  EstadoAtencion,
  EstadoPago,
} from './schema/cita.schema'

import { ConfiguracionService } from '../configuracion/configuracion.service'
import { Servicios } from '../servicios/schema/servicios.schema'
import { Productos } from '../producto/schema/productos.schema'

@Injectable()
export class CitaService {
  constructor(
    @InjectModel(Cita.name)
    private readonly citaModel: Model<Cita>,

    @InjectModel(Servicios.name)
    private readonly serviciosModel: Model<Servicios>,

    @InjectModel(Productos.name)
    private readonly productosModel: Model<Productos>,

    private readonly configuracionService: ConfiguracionService,
  ) {}

  // Crear una cita
  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    if (!Types.ObjectId.isValid(createCitaDto.cliente)) {
      throw new BadRequestException('El ID del cliente no es válido')
    }

    if (!Types.ObjectId.isValid(createCitaDto.servicio)) {
      throw new BadRequestException('El ID del servicio no es válido')
    }

    const existCita = await this.citaModel.findOne({
      fecha: new Date(createCitaDto.fecha),
      cliente: createCitaDto.cliente,
    })

    if (existCita) {
      throw new BadRequestException(
        'Ya tienes una cita registrada para esta fecha',
      )
    }

    const dia = createCitaDto.fecha.slice(0, 10)
    const inicio = new Date(`${dia}T00:00:00.000Z`)
    const fin = new Date(inicio.getTime() + 86400000)

    const [conteo, config] = await Promise.all([
      this.citaModel.countDocuments({
        fecha: { $gte: inicio, $lt: fin },
      }),
      this.configuracionService.encontrar(),
    ])

    const maximo = config.maxCitasPorDia || 10

    if (conteo >= maximo) {
      throw new BadRequestException(
        'Se alcanzó el límite de citas para esta fecha',
      )
    }

    const nuevaCita = new this.citaModel(createCitaDto)

    return nuevaCita.save()
  }

  // Buscar todas las citas
  async findAll(): Promise<Cita[]> {
    return this.citaModel
      .find()
      .sort({ createdAt: -1 })
      .exec()
  }

  // Buscar una cita
  async findOne(id: string): Promise<Cita> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    const cita = await this.citaModel.findById(id).exec()

    if (!cita) {
      throw new NotFoundException('No se encontró la cita')
    }

    return cita
  }

  // Actualizar una cita
  async update(
    id: string,
    updateCitaDto: UpdateCitaDto,
  ): Promise<Cita> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    const cita = await this.citaModel.findById(id).exec()

    if (!cita) {
      throw new NotFoundException('No se encontró la cita')
    }

    if (cita.procesandoRealizacion) {
      throw new BadRequestException(
        'No puedes modificar una cita mientras se está realizando',
      )
    }

    const intentaModificarDatos =
      updateCitaDto.cliente !== undefined ||
      updateCitaDto.servicio !== undefined ||
      updateCitaDto.fecha !== undefined

    if (
      cita.estadoAtencion === EstadoAtencion.REALIZADA &&
      intentaModificarDatos
    ) {
      throw new BadRequestException(
        'No puedes modificar el cliente, servicio o fecha de una cita realizada',
      )
    }

    if (updateCitaDto.cliente !== undefined) {
      cita.cliente = new Types.ObjectId(updateCitaDto.cliente)
    }

    if (updateCitaDto.servicio !== undefined) {
      cita.servicio = new Types.ObjectId(updateCitaDto.servicio)
    }

    if (updateCitaDto.fecha !== undefined) {
      cita.fecha = new Date(updateCitaDto.fecha)
    }

    return cita.save()
  }

  // Marcar una cita como realizada y descontar materiales
  async realizar(id: string): Promise<Cita> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    // Reservar la cita para evitar realizaciones simultáneas
    const cita = await this.citaModel
      .findOneAndUpdate(
        {
          _id: id,
          estadoAtencion: EstadoAtencion.PENDIENTE,
          procesandoRealizacion: { $ne: true },
        },
        {
          $set: { procesandoRealizacion: true },
        },
        { new: true },
      )
      .exec()

    if (!cita) {
      const existente = await this.citaModel.findById(id).exec()

      if (!existente) {
        throw new NotFoundException('No se encontró la cita')
      }

      if (existente.estadoAtencion === EstadoAtencion.REALIZADA) {
        throw new BadRequestException(
          'Esta cita ya fue realizada y sus materiales ya fueron descontados',
        )
      }

      if (existente.estadoAtencion === EstadoAtencion.CANCELADA) {
        throw new BadRequestException(
          'No se puede realizar una cita cancelada',
        )
      }

      throw new BadRequestException(
        'Esta cita ya está siendo procesada',
      )
    }

    const descuentosRealizados: {
      productoId: Types.ObjectId
      cantidad: number
    }[] = []

    try {
      // Buscar el servicio y sus productos
      const servicio: any = await this.serviciosModel
        .findById(cita.servicio)
        .populate('materiales.producto')
        .exec()

      if (!servicio) {
        throw new NotFoundException(
          'No se encontró el servicio asociado a la cita',
        )
      }

      if (servicio.disponible === false) {
        throw new BadRequestException(
          'El servicio no está disponible',
        )
      }

      const materiales = servicio.materiales || []

      // Agrupar materiales por producto
      const productosAgrupados = new Map<
        string,
        {
          producto: any
          cantidad: number
        }
      >()

      for (const material of materiales) {
        const producto = material.producto
        const cantidad = Number(material.cantidad)

        if (!producto || !producto._id) {
          throw new BadRequestException(
            'Uno de los productos del servicio ya no existe',
          )
        }

        if (producto.activo === false) {
          throw new BadRequestException(
            `El producto ${producto.nombre} está inactivo`,
          )
        }

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
          throw new BadRequestException(
            `La cantidad configurada para ${producto.nombre} no es válida`,
          )
        }

        const precioUnitario = Number(producto.precioCompra)

        if (
          !Number.isFinite(precioUnitario) ||
          precioUnitario < 0
        ) {
          throw new BadRequestException(
            `El precio de compra de ${producto.nombre} no es válido`,
          )
        }

        const productoId = producto._id.toString()
        const existente = productosAgrupados.get(productoId)

        if (existente) {
          existente.cantidad += cantidad
        } else {
          productosAgrupados.set(productoId, {
            producto,
            cantidad,
          })
        }
      }

      // Validar el stock de todos los productos antes de descontar
      for (const item of productosAgrupados.values()) {
        const { producto, cantidad } = item

        if (Number(producto.stock) < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, necesario: ${cantidad}`,
          )
        }
      }

      // Preparar el historial de materiales consumidos
      const materialesConsumidos = Array.from(
        productosAgrupados.values(),
      ).map(({ producto, cantidad }) => {
        const precioUnitario = Number(producto.precioCompra)

        return {
          producto: producto._id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          cantidad,
          precioUnitario,
          costoTotal: cantidad * precioUnitario,
        }
      })

      // Validar el precio del servicio
      const precioServicio = Number(servicio.precioServicio)

      if (
        !Number.isFinite(precioServicio) ||
        precioServicio < 0
      ) {
        throw new BadRequestException(
          'El precio del servicio no es válido',
        )
      }

      // Descontar cada producto una sola vez
      for (const [productoId, item] of productosAgrupados.entries()) {
        const actualizacion = await this.productosModel.updateOne(
          {
            _id: productoId,
            stock: { $gte: item.cantidad },
            activo: true,
          },
          {
            $inc: { stock: -item.cantidad },
          },
        )

        if (actualizacion.modifiedCount !== 1) {
          throw new BadRequestException(
            `No se pudo descontar el stock de ${item.producto.nombre}. Comprueba las existencias.`,
          )
        }

        descuentosRealizados.push({
          productoId: item.producto._id,
          cantidad: item.cantidad,
        })
      }

      // Guardar los datos de la realización
      cita.estadoAtencion = EstadoAtencion.REALIZADA
      cita.fechaRealizacion = new Date()

      // Se guarda inicialmente el precio del servicio.
      // Al registrar el pago podrá modificarse por el importe real.
      cita.precioCobrado = precioServicio

      cita.monedaCobro = servicio.monedaServicio
      cita.materialesConsumidos = materialesConsumidos
      cita.procesandoRealizacion = false

      return await cita.save()
    } catch (error) {
      // Intentar restaurar los productos descontados
      let falloReversion = false

      for (const descuento of descuentosRealizados.reverse()) {
        try {
          const reversion = await this.productosModel.updateOne(
            { _id: descuento.productoId },
            {
              $inc: { stock: descuento.cantidad },
            },
          )

          if (reversion.matchedCount !== 1) {
            falloReversion = true
          }
        } catch {
          falloReversion = true
        }
      }

      // Liberar la cita para permitir un nuevo intento
      try {
        await this.citaModel.updateOne(
          {
            _id: id,
            procesandoRealizacion: true,
            estadoAtencion: EstadoAtencion.PENDIENTE,
          },
          {
            $set: { procesandoRealizacion: false },
          },
        )
      } catch {
        falloReversion = true
      }

      if (falloReversion) {
        throw new InternalServerErrorException(
          'Ocurrió un error durante la realización y no se pudo completar la recuperación. Revisa manualmente el inventario y el estado de la cita.',
        )
      }

      throw error
    }
  }

  // Registrar el importe realmente cobrado
  async registrarPago(
    id: string,
    precioCobrado: number,
  ): Promise<Cita> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    if (
      typeof precioCobrado !== 'number' ||
      !Number.isFinite(precioCobrado) ||
      precioCobrado < 0 ||
      Math.abs(
        precioCobrado -
        Math.round(precioCobrado * 100) / 100,
      ) > 1e-8
    ) {
      throw new BadRequestException(
        'El importe cobrado debe ser un número válido, no negativo y con máximo dos decimales',
      )
    }

    // Actualización atómica para evitar pagos duplicados
    const cita = await this.citaModel
      .findOneAndUpdate(
        {
          _id: id,
          estadoAtencion: EstadoAtencion.REALIZADA,
          estadoPago: EstadoPago.PENDIENTE,
          procesandoRealizacion: { $ne: true },
        },
        {
          $set: {
            precioCobrado,
            estadoPago: EstadoPago.PAGADO,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec()

    if (cita) {
      return cita
    }

    const existente = await this.citaModel.findById(id).exec()

    if (!existente) {
      throw new NotFoundException('No se encontró la cita')
    }

    if (existente.estadoAtencion !== EstadoAtencion.REALIZADA) {
      throw new BadRequestException(
        'No puedes registrar el pago de un servicio que todavía no se ha realizado',
      )
    }

    if (existente.estadoPago === EstadoPago.PAGADO) {
      throw new BadRequestException(
        'Esta cita ya tiene un pago registrado',
      )
    }

    throw new BadRequestException(
      'No se puede registrar el pago mientras la cita está siendo procesada',
    )
  }

  // Eliminar una cita
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    const cita = await this.citaModel.findById(id).exec()

    if (!cita) {
      throw new NotFoundException('No se encontró la cita')
    }

    if (cita.procesandoRealizacion) {
      throw new BadRequestException(
        'No puedes eliminar una cita mientras se está realizando',
      )
    }

    if (cita.estadoAtencion === EstadoAtencion.REALIZADA) {
      throw new BadRequestException(
        'No puedes eliminar una cita realizada porque contiene un historial de consumo',
      )
    }

    await this.citaModel.findByIdAndDelete(id).exec()
  }
}
