
import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
  ) { }

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

    if (cita.estadoAtencion === EstadoAtencion.REALIZADA) {
      if (
        updateCitaDto.cliente ||
        updateCitaDto.servicio ||
        updateCitaDto.fecha
      ) {
        throw new BadRequestException(
          'No puedes modificar el cliente, servicio o fecha de una cita realizada',
        )
      }
    }

    if (
      updateCitaDto.estadoPago === EstadoPago.PAGADO &&
      cita.estadoAtencion !== EstadoAtencion.REALIZADA
    ) {
      throw new BadRequestException(
        'No puedes registrar el pago de un servicio que todavía no se ha realizado',
      )
    }

    Object.assign(cita, updateCitaDto)

    return cita.save()
  }


  // Marcar una cita como realizada y descontar materiales
  async realizar(id: string): Promise<Cita> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    const session = await this.citaModel.db.startSession()
    let resultado: any = null

    try {
      await session.withTransaction(async () => {
        const cita = await this.citaModel
          .findById(id)
          .session(session)
          .exec()

        if (!cita) {
          throw new NotFoundException('No se encontró la cita')
        }

        if (cita.estadoAtencion === EstadoAtencion.REALIZADA) {
          throw new BadRequestException(
            'Esta cita ya fue realizada y sus materiales ya fueron descontados',
          )
        }

        if (cita.estadoAtencion === EstadoAtencion.CANCELADA) {
          throw new BadRequestException(
            'No se puede realizar una cita cancelada',
          )
        }

        const servicio: any = await this.serviciosModel
          .findById(cita.servicio)
          .populate('materiales.producto')
          .session(session)
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
        const materialesConsumidos: any[] = []

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

          // Descontar únicamente si hay stock suficiente
          const actualizacion = await this.productosModel.updateOne(
            {
              _id: producto._id,
              stock: { $gte: cantidad },
              activo: true,
            },
            {
              $inc: { stock: -cantidad },
            },
            { session },
          )

          if (actualizacion.modifiedCount !== 1) {
            throw new BadRequestException(
              `Stock insuficiente para el producto ${producto.nombre}`,
            )
          }

          const precioUnitario = Number(producto.precioCompra)

          materialesConsumidos.push({
            producto: producto._id,
            nombre: producto.nombre,
            codigo: producto.codigo,
            cantidad,
            precioUnitario,
            costoTotal: cantidad * precioUnitario,
          })
        }

        // Guardar una copia de los datos económicos del servicio
        cita.estadoAtencion = EstadoAtencion.REALIZADA
        cita.fechaRealizacion = new Date()
        cita.precioCobrado = Number(servicio.precioServicio)
        cita.monedaCobro = servicio.monedaServicio
        cita.materialesConsumidos = materialesConsumidos

        await cita.save({ session })

        resultado = cita
      })

      return resultado
    } finally {
      await session.endSession()
    }
  }

  // Eliminar una cita
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la cita no es válido')
    }

    const deletecit = await this.citaModel
      .findByIdAndDelete(id)
      .exec()

    if (!deletecit) {
      throw new NotFoundException('No se encontró la cita')
    }
  }
}
