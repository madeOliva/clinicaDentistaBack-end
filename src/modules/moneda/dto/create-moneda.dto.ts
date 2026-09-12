import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMonedaDto {

    @ApiProperty({ example: 'SOL' })
    @IsString()
    @IsNotEmpty()
    tipoMoneda!: string;
}
