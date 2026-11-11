import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'


import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { Categoria, CategoriaDocument } from './schema/categoria.schema'

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<CategoriaDocument>,
  ) {}

  async findAll(): Promise<CategoriaDocument[]> {
    return this.categoriaModel
      .find()
      .sort({ nombre: 1 })
      .exec()
  }

  async findOne(id: string): Promise<CategoriaDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'El identificador de la categoría no es válido',
      )
    }

    const categoria = await this.categoriaModel
      .findById(id)
      .exec()

    if (!categoria) {
      throw new NotFoundException(
        'La categoría no existe',
      )
    }

    return categoria
  }

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaDocument> {
    const nombre = createCategoriaDto.nombre.trim()

    const categoriaExistente = await this.categoriaModel
      .findOne({
        nombre: {
          $regex: `^${nombre}$`,
          $options: 'i',
        },
      })
      .exec()

    if (categoriaExistente) {
      throw new ConflictException(
        'Ya existe una categoría con ese nombre',
      )
    }

    const nuevaCategoria = new this.categoriaModel({
      ...createCategoriaDto,
      nombre,
    })

    return nuevaCategoria.save()
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<CategoriaDocument> {
    await this.findOne(id)

    if (updateCategoriaDto.nombre) {
      const nombre = updateCategoriaDto.nombre.trim()

      const categoriaExistente = await this.categoriaModel
        .findOne({
          nombre: {
            $regex: `^${nombre}$`,
            $options: 'i',
          },
          _id: {
            $ne: id,
          },
        })
        .exec()

      if (categoriaExistente) {
        throw new ConflictException(
          'Ya existe otra categoría con ese nombre',
        )
      }

      updateCategoriaDto.nombre = nombre
    }

    const categoriaActualizada = await this.categoriaModel
      .findByIdAndUpdate(
        id,
        updateCategoriaDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec()

    if (!categoriaActualizada) {
      throw new NotFoundException(
        'No se pudo actualizar la categoría',
      )
    }

    return categoriaActualizada
  }

  async remove(id: string): Promise<{ mensaje: string }> {
    await this.findOne(id)

    await this.categoriaModel
      .findByIdAndDelete(id)
      .exec()

    return {
      mensaje: 'Categoría eliminada correctamente',
    }
  }
}