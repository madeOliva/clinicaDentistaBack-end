import { PartialType } from '@nestjs/swagger';
import { CreateMonedaDto } from './create-moneda.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMonedaDto extends PartialType(CreateMonedaDto) {
    @ApiProperty({ example: 'SOL' })
    @IsString()
    @IsNotEmpty()
    tipoMoneda: string;
}
