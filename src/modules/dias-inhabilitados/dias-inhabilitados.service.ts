import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDiaInhabilitadoDto } from './dto/create-dia-inhabilitado.dto';
import { UpdateDiaInhabilitadoDto } from './dto/update-dia-inhabilitado.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DiaInhabilitado } from './schema/dia-inhabilitado.schema';
import { Model } from 'mongoose';

@Injectable()
export class DiasInhabilitadosService {

  constructor(@InjectModel(DiaInhabilitado.name) private diaModel: Model<DiaInhabilitado>) {
    }

  //Registrar un día inhabilitado
    async create(
      createDiaDto: CreateDiaInhabilitadoDto,
    ): Promise<DiaInhabilitado> {
      const existDia = await this.diaModel.findOne({
        fecha: createDiaDto.fecha,
      });

      if (existDia) {
        throw new BadRequestException('El día ya está inhabilitado');
      }
      const nuevoDia = new this.diaModel(createDiaDto);
      return nuevoDia.save();
    }


  //Buscar todos los días inhabilitados
    async findAll(): Promise<DiaInhabilitado[]> {
      return this.diaModel
        .find()
        .sort({ fecha: 1 })
        .exec();
    }


  // Buscar un día inhabilitado
    async findOne(id: string): Promise<DiaInhabilitado> {
    const dia = await this.diaModel.findById(id).exec();
    if (!dia){
      throw new NotFoundException('No se encontró el día inhabilitado');
    }
    return dia;
   }



   //Actualizar un día inhabilitado
    async update( id: string, updateDiaDto: UpdateDiaInhabilitadoDto): Promise<DiaInhabilitado> {
    const updateDia = await this.diaModel.findByIdAndUpdate(id, updateDiaDto, {new :true}).exec();

    if (!updateDia) {
      throw new NotFoundException('No se encontró el día inhabilitado');
    }
    return updateDia;
  }



  //Eliminar un día inhabilitado

   async remove(id: string): Promise<void>{
    const deleteDia = await this.diaModel.findByIdAndDelete(id);

    if (!deleteDia) {
      throw new NotFoundException('No se encontró el día inhabilitado');
    }
  }
}