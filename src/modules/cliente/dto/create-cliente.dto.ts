import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClienteDto {

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    apellidos!: string;

    @IsString()
    @IsNotEmpty()
    telefono!: string;

    @IsOptional()
    @IsString()
    direccion?: string;
}