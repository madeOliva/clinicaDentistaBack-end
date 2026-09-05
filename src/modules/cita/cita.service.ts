import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cita } from './schema/cita.schema';
import { Model } from 'mongoose';

@Injectable()
export class CitaService {

  constructor(@InjectModel(Cita.name) private citaModel: Model<Cita>) {
    }

  //Crear una cita
    async create(
      createCitaDto: CreateCitaDto,
    ): Promise<Cita> {
      const existCita = await this.citaModel.findOne({
        fecha: createCitaDto.fecha,
      });

      if (existCita) {
        throw new BadRequestException('Ya existe la cita para esta fecha');
      }
      const nuevaCita = new this.citaModel(createCitaDto);
      return nuevaCita.save();
    }


  //Buscar todas las citas
    async findAll(): Promise<Cita[]> {
      return this.citaModel
        .find()
        .sort({ createdAt: -1 })
        .exec();
    }


  // Buscar una cita
    async findOne(id: string): Promise<Cita> {
    const cit = await this.citaModel.findById(id).exec();
    if (!cit){
      throw new NotFoundException('No se encontró la cita');
    }
    return cit;
   }



   //Actualizar una cita
    async update( id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const updatecit = await this.citaModel.findByIdAndUpdate(id, updateCitaDto, {new :true}).exec();

    if (!updatecit) {
      throw new NotFoundException('No se encontró la cita');
    }
    return updatecit;
  }



  //Eliminar una cita

   async remove(id: string): Promise<void>{
    const deletecit = await this.citaModel.findByIdAndDelete(id);

    if (!deletecit) {
      throw new NotFoundException('No se encontró la cita');
    }
  }
}