import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateClienteDto {

    @ApiProperty({ example: '03074563666' })
    @IsString()
    @IsNotEmpty()
    ci!: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty({ example: 'Perez Gomez' })
    @IsString()
    @IsNotEmpty()
    apellidos!: string;

    @ApiProperty({ example: '+51 999 888 777' })
    @IsString()
    @IsNotEmpty()
    telefono!: string;

    @ApiPropertyOptional({ example: 'Av. Los Olivos 123' })
    @IsOptional()
    @IsString()
    direccion?: string;
}