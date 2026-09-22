import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class HorarioDto {
  @ApiPropertyOptional({ example: 'Lunes a Viernes' })
  @IsOptional()
  @IsString()
  days?: string;

  @ApiPropertyOptional({ example: '8:00 AM – 6:00 PM' })
  @IsOptional()
  @IsString()
  hours?: string;
}

export class CreateConfiguracionDto {
  @ApiProperty({ example: 'Clínica Dental ChinaBeautySalón' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Av. Principal #123, Sector El Centro, Ciudad' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+53 55912936' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 'contacto@clinicadental.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '55912936' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'https://wa.me/55912936?text=Hola' })
  @IsOptional()
  @IsString()
  whatsappUrl?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/clinicadental' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/clinicadental' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ type: () => [HorarioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  schedule?: HorarioDto[];

  @ApiPropertyOptional({ example: 10, description: 'Cantidad máxima de citas que se pueden reservar en un día' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxCitasPorDia?: number;
}