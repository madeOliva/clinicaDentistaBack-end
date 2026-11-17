
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

import { Servicios } from './schema/servicios.schema';
import { Productos } from '../producto/schema/productos.schema';


@Injectable()
export class ServiciosService {
  constructor(
    @InjectModel(Servicios.name)
    private readonly serviciosModel: Model<Servicios>,

    @InjectModel(Productos.name)
    private readonly productosModel: Model<Productos>,
  ) {}

  // Comprobar que los materiales existan y estén activos.
  private async validarMateriales(
    materiales?: { producto: string; cantidad: number }[],
  ): Promise<void> {
    if (!materiales || materiales.length === 0) {
      return;
    }

    const ids = materiales.map((material) => material.producto);

    const idsUnicos = new Set(ids);

    if (idsUnicos.size !== ids.length) {
      throw new BadRequestException(
        'No puedes agregar el mismo producto más de una vez.',
      );
    }

    const productos = await this.productosModel.find({
      _id: { $in: ids },
      activo: true,
    }).exec();

    if (productos.length !== ids.length) {
      throw new BadRequestException(
        'Uno o más materiales no existen o están inactivos.',
      );
    }
  }

  // Crear un servicio.
  async create(
    createServicioDto: CreateServicioDto,
  ): Promise<Servicios> {
    const existS = await this.serviciosModel.findOne({
      nombreServicio: createServicioDto.nombreServicio,
    });

    if (existS) {
      throw new BadRequestException('Ya existe el servicio');
    }

    await this.validarMateriales(createServicioDto.materiales);

    const nuevoS = new this.serviciosModel(createServicioDto);

    return nuevoS.save();
  }

  // Buscar todos los servicios y sus materiales.
  async findAll(): Promise<Servicios[]> {
    return this.serviciosModel
      .find()
      .populate(
        'materiales.producto',
        'nombre codigo unidadMedida precioCompra stock activo',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  // Buscar un servicio por ID.
  async findOne(id: string): Promise<Servicios> {
    const ser = await this.serviciosModel
      .findById(id)
      .populate(
        'materiales.producto',
        'nombre codigo unidadMedida precioCompra stock activo',
      )
      .exec();

    if (!ser) {
      throw new NotFoundException('No se encontró el servicio');
    }

    return ser;
  }

  // Actualizar un servicio.
  async update(
    id: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<Servicios> {
    const servicioExistente =
      await this.serviciosModel.findById(id).exec();

    if (!servicioExistente) {
      throw new NotFoundException('No se encontró el servicio');
    }

    if (updateServicioDto.materiales !== undefined) {
      await this.validarMateriales(updateServicioDto.materiales);
    }

    const updates = await this.serviciosModel
      .findByIdAndUpdate(
        id,
        updateServicioDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .populate(
        'materiales.producto',
        'nombre codigo unidadMedida precioCompra stock activo',
      )
      .exec();

    if (!updates) {
      throw new NotFoundException('No se encontró el servicio');
    }

    return updates;
  }

  // Eliminar un servicio.
  async remove(id: string): Promise<void> {
    const deletes = await this.serviciosModel.findByIdAndDelete(id);

    if (!deletes) {
      throw new NotFoundException('No se encontró el servicio');
    }
  }
}
