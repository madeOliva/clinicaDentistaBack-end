import { IsCiValida } from "./ci-validator";

export class CiParamDto {

    @IsCiValida()
    ci!: string;
}