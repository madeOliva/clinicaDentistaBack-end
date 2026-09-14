import { IsDateString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDiaInhabilitadoDto {

    @ApiProperty({ example: '2026-09-12' })
    @IsDateString()
    @IsNotEmpty()
    fecha!: string;
}