import { IsDateString, IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateCitaDto {

    @IsMongoId()
    @IsNotEmpty()
    cliente!: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    servicio!: Types.ObjectId;

    @IsDateString()
    @IsNotEmpty()
    fecha!: string;
}