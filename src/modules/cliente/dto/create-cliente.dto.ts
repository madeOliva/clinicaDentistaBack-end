import { IsNotEmpty, IsOptional, IsString, Matches, IsInt, Min, Max } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsCiValida } from "./ci-validator";

export class CreateClienteDto {

    @ApiProperty({ example: '92051234785' })
    @IsString()
    @IsNotEmpty()
    @IsCiValida()
    ci!: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'El nombre solo debe contener letras' })
    nombre!: string;

    @ApiProperty({ example: 'Perez Gomez' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'Los apellidos solo deben contener letras' })
    apellidos!: string;

    @ApiProperty({ example: '+51 999 888 777' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9+\s-]+$/, { message: 'El teléfono solo debe contener números' })
    telefono!: string;

    @ApiPropertyOptional({ example: 32 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(120)
    edad?: number;

    @ApiPropertyOptional({ example: 'Av. Los Olivos 123' })
    @IsOptional()
    @IsString()
    direccion?: string;
}