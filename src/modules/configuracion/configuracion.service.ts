import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Configuracion, ConfiguracionDocument } from './schema/configuracion.schema';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

const VALORES_POR_DEFECTO: CreateConfiguracionDto = {
  name: 'Clínica Dental ChinaBeautySalón',
  address: 'Av. Principal #123, Sector El Centro, Ciudad',
  telephone: '+53 55912936',
  email: 'contacto@clinicadental.com',
  whatsapp: '55912936',
  whatsappUrl: 'https://wa.me/55912936?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n.',
  facebook: 'https://facebook.com/clinicadental',
  instagram: 'https://instagram.com/clinicadental',
  schedule: [
    { days: 'Lunes a Viernes', hours: '8:00 AM – 6:00 PM' },
    { days: 'Sábado', hours: '8:00 AM – 1:00 PM' },
    { days: 'Domingo', hours: 'Cerrado' },
  ],
  maxCitasPorDia: 10,
};

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectModel(Configuracion.name)
    private readonly configuracionModel: Model<ConfiguracionDocument>,
  ) {}

  async crear(dto: CreateConfiguracionDto): Promise<Configuracion> {
    return this.configuracionModel.create(dto);
  }

  async encontrar(): Promise<Configuracion> {
    let configuracion = await this.configuracionModel.findOne().exec();
    if (!configuracion) {
      configuracion = await this.configuracionModel.create(VALORES_POR_DEFECTO);
    }
    return configuracion;
  }

  async actualizar(
    dto: UpdateConfiguracionDto,
  ): Promise<Configuracion> {
    const actualizada = await this.configuracionModel
      .findOneAndUpdate({}, dto, { new: true, upsert: true, runValidators: true })
      .exec();

    if (!actualizada) {
      throw new NotFoundException('No se encontró la configuración');
    }
    return actualizada;
  }
}