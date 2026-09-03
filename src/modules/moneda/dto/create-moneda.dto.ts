import { IsNotEmpty, IsString } from "class-validator";

export class CreateMonedaDto {

    @IsString()
    @IsNotEmpty()
    tipoMoneda!: string;
}
