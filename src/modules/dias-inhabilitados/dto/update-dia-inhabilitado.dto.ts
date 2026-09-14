import { PartialType } from "@nestjs/swagger";
import { CreateDiaInhabilitadoDto } from "./create-dia-inhabilitado.dto";

export class UpdateDiaInhabilitadoDto extends PartialType(CreateDiaInhabilitadoDto) {}