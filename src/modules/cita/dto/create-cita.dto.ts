import { IsDateString, IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCitaDto {

    @ApiProperty({ example: '6655f0c9a1b2c3d4e5f6a7b8' })
    @IsMongoId()
    @IsNotEmpty()
    cliente!: Types.ObjectId;

    @ApiProperty({ example: '6655f0c9a1b2c3d4e5f6a7b9' })
    @IsMongoId()
    @IsNotEmpty()
    servicio!: Types.ObjectId;

    @ApiProperty({ example: '2026-09-12T10:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    fecha!: string;
}