import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class CreateServicioDto {

    @ApiProperty({ example: 'Limpieza dental' })
    @IsString()
    @IsNotEmpty()
    nombreServicio!: string;

    @ApiProperty({ example: 'Limpieza profesional con ultrasonido' })
    @IsString()
    @IsNotEmpty()
    descripcionServicio!: string;

    @ApiProperty({ example: 150.5 })
    @IsNumber()
    @IsNotEmpty()
    precioServicio!: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    disponible?: boolean;

    @ApiProperty({ example: '6655f0c9a1b2c3d4e5f6a7b8' })
    @IsMongoId()
    @IsNotEmpty()
    monedaServicio!: Types.ObjectId;
}
