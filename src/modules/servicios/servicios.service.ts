import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Servicios } from './schema/servicios.schema';
import { Model } from 'mongoose';
import { Moneda } from '../moneda/schema/moneda.schema';

@Injectable()
export class ServiciosService {
  constructor(@InjectModel(Servicios.name)private serviciosModel:Model<Servicios>){
        
      } 
  
    //Crear un servicio
      async create(
        createServicioDto: CreateServicioDto,
      ): Promise<Servicios> {
        const existS = await this.serviciosModel.findOne({
          nombreServicio: createServicioDto.nombreServicio,
        });
    
        if (existS) {
          throw new BadRequestException('Ya existe el servicio');
        }
        const nuevoS = new this.serviciosModel(createServicioDto);
        return nuevoS.save();
      }
  
  
    //Buscar todas los servicios
      async findAll(): Promise<Servicios[]> {
        return this.serviciosModel
          .find()
          .sort({ createdAt: -1 })
          .exec();
      }
    
  
    // Buscar un servicio
      async findOne(id:string): Promise<Servicios> {
      const ser = await this.serviciosModel.findById(id).exec();
      if (!ser){
        throw new NotFoundException('No se encontró el servicio');
      }
      return ser;
     }
  
  
  
     //Actualizar un servicio
      async update( id: string, updateServicioDto: UpdateServicioDto): Promise<Servicios> {
      const updates = await this.serviciosModel.findByIdAndUpdate(id, updateServicioDto, {new :true}).exec();
    
      if (!updates) {
        throw new NotFoundException('No se encontró el servico');
      }
      return updates;
    }
  
  
  
    //Eliminar un servicio
    
     async remove(id: string): Promise<void>{
      const deletes = await this.serviciosModel.findByIdAndDelete(id);
    
      if (!deletes) {
        throw new NotFoundException('No se encontró el servicio');
      }
    }
}
