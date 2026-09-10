import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateServicioDto {

    @IsString()
    @IsNotEmpty()
    nombreServicio!: string;


    @IsString()
    @IsNotEmpty()
    descripcionServicio!: string;

    @IsNumber()
    @IsNotEmpty()
    precioServicio!: number;

    @IsMongoId()
    @IsNotEmpty()
    monedaServicio!: Types.ObjectId;
}
