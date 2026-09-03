import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    @IsString()
    @IsNotEmpty()
    monedaServicio!: string;
}
